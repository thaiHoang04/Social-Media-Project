export const Post = (id, content, author, avatar, timestamp, imageStatus, totalLike = 0, totalComment = 0) => ({
    id,
    content,
    author,
    avatar,
    timestamp,
    imageStatus,
    totalLike,
    totalComment
});
  
// Sample posts
export const membersPosts = [
    Post(
      1,
      "Lost & Found: A jacket was left in the library. Please contact me if you think it's yours.",
      "Mary Johnson",
      "/images/avatar3.jpg",
      "2024-08-24 10:00",
      "/images/jacket.jpg",
      3,
      3
    ),
    Post(
      2,
      "RMIT at Night!",
      "Jane Kim",
      "/images/rmitb2.jpg",
      "2024-08-18 11:30",
      "/images/rmitnight.jpg",
      1,
      3
    )
];