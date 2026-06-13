import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_DATA = {
  username: '_sakshi19_',
  solved: 0,
  rating: 0,
  rank: 'N/A',
  topPercentage: 0,
  globalRanking: 0,
  contestCount: 0,
  badges: [],
  history: [],
  calendar: {},
  activeDays: 0,
  streak: 0
};

async function getLeetCode(username: string) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          badges { displayName icon creationDate category }
          userCalendar {
            activeYears
            streak
            totalActiveDays
          }
          submissionCalendar
        }
        userContestRanking(username: $username) { 
          rating 
          topPercentage 
          attendedContestsCount
          globalRanking
        }
        userContestRankingHistory(username: $username) {
          rating
          ranking
          contest { title startTime }
        }
      }
    `;
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch from LeetCode: ${res.status}`);
    }

    const data = await res.json();
    const matchedUser = data.data?.matchedUser;
    const stats = matchedUser?.submitStats?.acSubmissionNum;
    const solved = stats ? stats.find((s: { difficulty: string; count: number }) => s.difficulty === 'All')?.count : FALLBACK_DATA.solved;
    const contest = data.data?.userContestRanking;
    const history = data.data?.userContestRankingHistory || [];
    
    let calendar = {};
    try {
      calendar = matchedUser?.submissionCalendar ? JSON.parse(matchedUser.submissionCalendar) : {};
    } catch {
      calendar = {};
    }

    return {
      username,
      solved: solved || 0,
      rating: contest?.rating ? Math.round(contest.rating) : 0,
      rank: contest?.globalRanking ? contest.globalRanking.toLocaleString() : 'N/A',
      topPercentage: contest?.topPercentage || 0,
      globalRanking: contest?.globalRanking || 0,
      contestCount: contest?.attendedContestsCount || 0,
      badges: matchedUser?.badges || [],
      history: history.filter((h: { rating?: number; contest?: unknown }) => h.rating && h.contest).slice(-20), // Last 20 attended contests
      calendar,
      activeDays: matchedUser?.userCalendar?.totalActiveDays || 0,
      streak: matchedUser?.userCalendar?.streak || 0
    };
  } catch (error) {
    console.error('LeetCode fetch error:', error);
    return FALLBACK_DATA;
  }
}

export async function GET() {
  const leetcode = await getLeetCode('_sakshi19_');

  return NextResponse.json({
    leetcode
  });
}
