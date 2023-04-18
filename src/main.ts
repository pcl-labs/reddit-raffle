import {
  Context,
  ContextActionEvent,
  Devvit,
  RedditAPIClient,
  UserContext,
} from "@devvit/public-api";
import { Metadata } from "@devvit/protos";

const reddit = new RedditAPIClient();

/**
 * Fetch the current strike count for the author
 */
async function getWinner(comments: any) {
  const winnerIndex = Math.floor(Math.random() * comments.length);

  // Get the winning comment from the comments array
  const winner = comments[winnerIndex];

  const input = winner.id;
  const parts = input.split("_");

  return {
    author: winner.authorName,
    comment_id: parts[1],
  };
}

async function raffle(event: ContextActionEvent, metadata?: Metadata) {
  // Get some relevant data from the post or comment
  if (event.context === Context.POST) {
    const comments = await reddit
      .getComments(
        {
          postId: `${event.post.name}`,
          limit: 1000,
          pageSize: 100,
        },
        metadata
      )
      .all();

    // Generate a random index to select a winner
    const winningComment = await getWinner(comments);

    await reddit.submitComment(
      {
        id: `${event.post.name}`,
        text: `u/${winningComment.author} won the Raffle! Comment: ${winningComment.comment_id}`,
      },
      metadata
    );
  }

  return {
    success: true,
    message: `Winner Selected. View pinned comment in post.`,
  };
}

/**
 * Declare our custom mod-only actions and add it to Posts and Comments
 */
Devvit.addActions([
  {
    name: "Run Raffle",
    description: "Pick a Winner!",
    context: [Context.POST, Context.COMMENT],
    userContext: UserContext.MODERATOR,
    handler: raffle,
  },
]);

export default Devvit;
