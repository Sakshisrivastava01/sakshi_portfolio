import fetch from 'node-fetch';

async function verifyLeetCodeGraphQL() {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
        badges {
          displayName
          icon
        }
        submissionCalendar
      }
      userContestRanking(username: $username) {
        rating
        topPercentage
        attendedContestsCount
      }
      userContestRankingHistory(username: $username) {
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `;
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: '_sakshi19_' } })
  });
  const data = await res.json();
  
  if (data.data) {
    console.log("Submit Stats:", data.data.matchedUser.submitStats.acSubmissionNum);
    console.log("Contest Ranking:", data.data.userContestRanking);
    console.log("Badges:", data.data.matchedUser.badges);
    console.log("Contest History (first 2):", data.data.userContestRankingHistory.slice(0, 2));
    console.log("Calendar length:", Object.keys(JSON.parse(data.data.matchedUser.submissionCalendar || '{}')).length);
  } else {
    console.log("Error:", data);
  }
}

verifyLeetCodeGraphQL().catch(console.error);
