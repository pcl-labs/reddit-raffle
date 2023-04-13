import { Context, Devvit, UserContext, PostContextActionEvent } from '@devvit/public-api';
const reddit = new RedditAPIClient();


async function fetchCommenters(reddit: any, postId: string) {
  try {
    const post = await reddit.getSubmission(postId).fetch();
    const commentAuthors = new Set<string>();

    await post.expandReplies({ limit: Infinity, depth: Infinity });
    post.comments.forEach((comment: any) => {
      commentAuthors.add(comment.author.name);
    });

    return Array.from(commentAuthors);
  } catch (error) {
    console.error('Error fetching commenters:', error);
    throw new Error('Error fetching commenters');
  }
}

Devvit.addAction({
  context: Context.POST,
  userContext: UserContext.MODERATOR,
  name: 'Run Raffle',
  description: 'Select a winner from the commenters on this post',
  handler: async (event: PostContextActionEvent & { reddit?: any }) => {
    if (!event.post?.id) {
      return { success: false, message: 'Error: Post ID not found' };
    }

    if (!event.reddit) {
      return { success: false, message: 'Error: Reddit API not available' };
    }

    try {
      const commenters = await fetchCommenters(event.reddit, event.post.id);

      if (commenters.length === 0) {
        return { success: false, message: 'No comments found on the post' };
      }

      const winnerIndex = Math.floor(Math.random() * commenters.length);
      const winner = commenters[winnerIndex];

      const message = `Raffle winner: ${winner} (Post ID: ${event.post.id})`;
      console.log(message);
      return { success: true, message };
    } catch (error) {
      console.error('Error running raffle:', error);
      return { success: false, message: 'Error running raffle' };
    }
  },
});

export default Devvit;
