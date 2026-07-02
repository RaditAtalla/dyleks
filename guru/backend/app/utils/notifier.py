import os
import asyncio
from typing import Dict, Set
from db import DB_PATH

class EventNotifier:
    def __init__(self):
        # Maps teacher_id to a set of subscriber queues
        self.listeners: Dict[str, Set[asyncio.Queue]] = {}

    def subscribe(self, teacher_id: str) -> asyncio.Queue:
        if teacher_id not in self.listeners:
            self.listeners[teacher_id] = set()
        queue = asyncio.Queue()
        self.listeners[teacher_id].add(queue)
        return queue

    def unsubscribe(self, teacher_id: str, queue: asyncio.Queue):
        if teacher_id in self.listeners:
            self.listeners[teacher_id].discard(queue)
            if not self.listeners[teacher_id]:
                del self.listeners[teacher_id]

    async def notify_all(self, message: str):
        for teacher_id, queues in list(self.listeners.items()):
            for queue in list(queues):
                await queue.put(message)

notifier = EventNotifier()

class DBWatcher:
    def __init__(self, db_path: str, notifier_inst: EventNotifier, interval: float = 1.0):
        self.db_path = db_path
        self.notifier = notifier_inst
        self.interval = interval
        self.last_mtime = self._get_mtime()
        self.task = None

    def _get_mtime(self) -> float:
        try:
            mtime = os.path.getmtime(self.db_path)
            # If SQLite is running in WAL mode, check the -wal file as well
            wal_path = f"{self.db_path}-wal"
            if os.path.exists(wal_path):
                mtime = max(mtime, os.path.getmtime(wal_path))
            return mtime
        except Exception:
            return 0.0

    async def start(self):
        if self.task is None or self.task.done():
            self.last_mtime = self._get_mtime()
            self.task = asyncio.create_task(self._watch_loop())

    async def stop(self):
        if self.task and not self.task.done():
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

    async def _watch_loop(self):
        while True:
            try:
                await asyncio.sleep(self.interval)
                current_mtime = self._get_mtime()
                if current_mtime != self.last_mtime:
                    # Only notify if we had a valid previous mtime to avoid startup trigger
                    if self.last_mtime != 0.0:
                        await self.notifier.notify_all("change:database")
                    self.last_mtime = current_mtime
            except asyncio.CancelledError:
                break
            except Exception as e:
                # Silently sleep or log in dev console
                print(f"Error in DBWatcher loop: {e}")
                await asyncio.sleep(self.interval)

# Singleton watcher instance
watcher = DBWatcher(DB_PATH, notifier)
