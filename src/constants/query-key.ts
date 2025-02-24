import { useGetParticipatedCourses } from '@/hooks/instructor/transaction/useInstructorTransaction'

const QUERY_KEY = {
  AUTH: 'auth',
  PROFILE: 'profile',
  CHANGE_PASSWORD: 'change-password',
  COURSES_DISCOUNTED: 'discounted-courses',
  COURSES_FREE: 'free-courses',
  INSTRUCTOR_COURSE: 'instructor-course',
  INSTRUCTOR_CHAPTER: 'instructor-chapter',
  INSTRUCTOR_LESSON: 'instructor-lesson',
  INSTRUCTOR_COURSE_VALIDATE: 'instructor-course-validate',
  INSTRUCTOR_CHECK_COURSE_COMPLETED: 'instructor-check-course-completed',
  INSTRUCTOR_CHAPTER_DETAIL: 'instructor-chapter-detail',
  INSTRUCTOR_LESSON_CODING: 'instructor-lesson-coding',
  INSTRUCTOR_GET_PARTICIPATED_COURSE: 'instructor-get-participated-courses',
  CATEGORY: 'categories',
  COURSE: 'course',
  QA_SYSTEM: 'qa-systems',
  POSTS: 'posts',
  BLOGS: 'blogs',
  BLOG_DETAILS: 'blog-details',
  WISH_LIST: 'wish-list',
  SEARCH: 'search',
  VALIDATE_COURSE: 'validate-course',
  INSTRUCTOR_QUIZ: 'instructor-quiz',
  INSTRUCTOR_QUESTION: 'instructor-question',
  INSTRUCTOR_LESSON_VIDEO: 'instructor-lesson-video',
  INSTRUCTOR_LESSON_DOCUMENT: 'instructor-lesson-document',
  USER_NOTIFICATION: 'user-notification',
  USER_GET_MY_COURSES: 'user-get-my-courses',
  LEARNING_PATH_LESSON: 'learning-path-lesson',
}

export default QUERY_KEY
