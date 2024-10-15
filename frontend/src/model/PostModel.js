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
  export const initialPosts = [
    Post(
      1,
      "Just had an amazing coffee at my favorite café!",
      "John Doe",
      "/images/avatar1.jpg",
      "2024-08-18 09:00",
      "/images/avatar1.jpg",
      3,
      3
    ),
    Post(
      2,
      "Finished a great book today - highly recommend it!",
      "Jane Smith",
      "/images/avatar1.jpg",
      "2024-08-18 11:30",
      "/images/avatar2.jpg",
      1,
      3
    ),
    Post(
      3,
      "Went for a long walk and enjoyed the sunset 🌅. Excited to start a new project at work tomorrow.",
      "Alice Johnson",
      '/images/avatar1.jpg',
      "2024-08-17 19:15",
      "/images/avatar1.jpg",
      0,
      0
    ),
    Post(
      4,
      "Excited to start a new project at work tomorrow.",
      "Bob Brown",
      "/images/avatar2.jpg",
      "2024-08-16 08:45",
      "/images/avatar1.jpg",
      2,
      1
    )
  ];