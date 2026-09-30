import { Camera, BookMarked, Brain, Search, GraduationCap, Bot } from 'lucide-react'
import SnapPage from '../features/snap/SnapPage'
import NotebookPage from '../features/notebook/NotebookPage'
import ReviewPage from '../features/review/ReviewPage'
import DictionaryPage from '../features/dictionary/DictionaryPage'
import LessonsPage from '../features/lessons/LessonsPage'
import TutorPage from '../features/tutor/TutorPage'

// Thêm tính năng mới: tạo thư mục trong features/ rồi thêm một dòng vào đây.
export const features = [
  { path: '/', label: 'Chụp', icon: Camera, page: SnapPage },
  { path: '/notebook', label: 'Sổ tay', icon: BookMarked, page: NotebookPage },
  { path: '/review', label: 'Ôn tập', icon: Brain, page: ReviewPage },
  { path: '/dictionary', label: 'Tra từ', icon: Search, page: DictionaryPage },
  { path: '/lessons', label: 'Bài học', icon: GraduationCap, page: LessonsPage },
  { path: '/tutor', label: 'Gia sư AI', icon: Bot, page: TutorPage },
]
