import { NextResponse } from 'next/server';

const FALLBACK_DATA = {
  username: '_sakshi19_',
  solved: 470,
  rating: 1735,
  rank: '11.16%',
  contestCount: 0,
  badges: [],
  history: [],
  calendar: {}
};

async function getLeetCode(username: string) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          badges { displayName icon }
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
          contest { title startTime }
        }
      }
    `;
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }
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
      solved: solved || FALLBACK_DATA.solved,
      rating: contest?.rating ? Math.round(contest.rating) : FALLBACK_DATA.rating,
      rank: contest?.topPercentage ? `Top ${contest.topPercentage}%` : FALLBACK_DATA.rank,
      contestCount: contest?.attendedContestsCount || FALLBACK_DATA.contestCount,
      badges: matchedUser?.badges || [],
      history: history.filter((h: { rating?: number; contest?: unknown }) => h.rating && h.contest).slice(-20), // Last 20 attended contests
      calendar
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
