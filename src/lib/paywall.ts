// Central place that decides what's free vs locked. Pages call these
// instead of each re-implementing the rule, so pricing behaviour always
// comes from the CMS fields you set (Topic.freeLessonCount, Book.freeChapterCount)
// and never from a hardcoded number in a component.
//
// IDs are typed string | number because Payload's default ID type can be
// either depending on your DB adapter config — these helpers normalize
// with String() before comparing so it works either way.

export function isLessonFree(orderInTopic: number, freeLessonCount: number): boolean {
  return orderInTopic <= freeLessonCount
}

export function isChapterFree(orderInBook: number, freeChapterCount: number): boolean {
  return orderInBook <= freeChapterCount
}

export function userHasUnlockedTopic(
  unlockedTopicIds: Array<string | number>,
  topicId: string | number,
): boolean {
  return unlockedTopicIds.some((id) => String(id) === String(topicId))
}

export function userHasUnlockedBook(
  unlockedBookIds: Array<string | number>,
  bookId: string | number,
): boolean {
  return unlockedBookIds.some((id) => String(id) === String(bookId))
}

/** Combines the free-count rule with a purchase — true means "show full content". */
export function canAccessLesson(params: {
  orderInTopic: number
  freeLessonCount: number
  topicId: string | number
  unlockedTopicIds: Array<string | number>
}): boolean {
  return (
    isLessonFree(params.orderInTopic, params.freeLessonCount) ||
    userHasUnlockedTopic(params.unlockedTopicIds, params.topicId)
  )
}

export function canAccessChapter(params: {
  orderInBook: number
  freeChapterCount: number
  bookId: string | number
  unlockedBookIds: Array<string | number>
}): boolean {
  return (
    isChapterFree(params.orderInBook, params.freeChapterCount) ||
    userHasUnlockedBook(params.unlockedBookIds, params.bookId)
  )
}
