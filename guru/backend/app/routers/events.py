from fastapi import APIRouter, Query, Request
from fastapi.responses import StreamingResponse
import asyncio

from app.utils.notifier import notifier

router = APIRouter(prefix="/api/events", tags=["events"])

@router.get("/subscribe")
async def subscribe(request: Request, teacher_id: str = Query(...)):
    queue = notifier.subscribe(teacher_id)
    
    async def event_generator():
        try:
            # Send initial retry configuration
            yield "retry: 2000\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    # Non-blocking wait for changes, with a timeout to check if client disconnected
                    message = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {message}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive comment to prevent network timeouts
                    yield ": keepalive\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            notifier.unsubscribe(teacher_id, queue)

    return StreamingResponse(
        event_generator(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
