##Reddit Raffle App
The Reddit Raffle App is a custom action for subreddit moderators to easily select a random winner from the commenters on a post. This can be useful for giveaways, contests, or any other events that require a random selection from the participants.

#Functionality
The raffle app is a custom action that can be triggered by a subreddit moderator from the post context menu. The app fetches all unique commenters from the selected post, and then selects a random winner from the list of commenters. The raffle winner is then logged in the console, and a success message is displayed to the moderator.

#How to Use
As a moderator, locate the post you want to run a raffle on.
Open the context menu for the post and select the "Run Raffle" custom action.
The raffle app will fetch all commenters from the post, select a random winner, and display the result in the form of a message as well as make a comment on the post itself.

#Limitations and Considerations
The current implementation relies on the Reddit API to fetch comments and perform the raffle. Ensure that you have a valid Reddit API integration and proper permissions for the app to work correctly.
