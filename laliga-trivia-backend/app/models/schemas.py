from pydantic import BaseModel
from typing import List, Optional

class QuestionResponse(BaseModel):
    id: int
    level: int
    question: str
    options: List[str]

class AnswerSubmit(BaseModel):
    session_id: str
    selected_option: str

class AnswerResponse(BaseModel):
    correct: bool
    correct_option: Optional[str] = None
    game_over: bool
    game_won: bool
    next_question: Optional[QuestionResponse] = None

class GameSessionStart(BaseModel):
    session_id: str
    level: int
    question: QuestionResponse

