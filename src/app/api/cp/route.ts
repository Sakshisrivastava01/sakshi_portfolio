import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Fallbacks in case fetching fails
const FALLBACK_DATA = {
  leetcode: { username: '_sakshi19_', solved: 470, rating: 1735, rank: '11.16%' },
  codeforces: { username: 'sakshi_190819', solved: 150, rating: 367, rank: 'newbie' },
  codechef: { username: 'sakshi_200306', solved: 406, rating: 1308, rank: '1★' },
  gfg: { username: 'sakshisrivasq50o', solved: 100, rating: 'N/A', rank: 'N/A' },
  hackerrank: { username: 'sakshisrivasta41', solved: 'N/A', rating: 'N/A', rank: '3 Badges' }
};

async function getLeetCode(username: string) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          profile { ranking starRating }
        }
        userContestRanking(username: $username) { rating topPercentage }
      }
    `;
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const stats = data.data?.matchedUser?.submitStats?.acSubmissionNum;
    const solved = stats ? stats.find((s: { difficulty: string; count: number }) => s.difficulty === 'All')?.count : FALLBACK_DATA.leetcode.solved;
    const contest = data.data?.userContestRanking;
    
    return {
      username,
      solved: solved || FALLBACK_DATA.leetcode.solved,
      rating: contest?.rating ? Math.round(contest.rating) : FALLBACK_DATA.leetcode.rating,
      rank: contest?.topPercentage ? `Top ${contest.topPercentage}%` : FALLBACK_DATA.leetcode.rank
    };
  } catch (e) {
    return FALLBACK_DATA.leetcode;
  }
}

async function getCodeforces(handle: string) {
  try {
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { next: { revalidate: 3600 } });
    const infoData = await infoRes.json();
    const user = infoData.result?.[0];
    
    return {
      username: handle,
      solved: FALLBACK_DATA.codeforces.solved, // CF API doesn't easily give total solved without fetching all submissions
      rating: user?.rating || FALLBACK_DATA.codeforces.rating,
      rank: user?.rank || FALLBACK_DATA.codeforces.rank
    };
  } catch (e) {
    return FALLBACK_DATA.codeforces;
  }
}

async function getCodeChef(username: string) {
  try {
    const res = await fetch(`https://www.codechef.com/users/${username}`, { next: { revalidate: 3600 } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const ratingStr = $('.rating-number').text().trim();
    const rating = ratingStr ? parseInt(ratingStr) : FALLBACK_DATA.codechef.rating;
    
    // Extract stars (e.g. 1★)
    const starsMatch = html.match(/class="rating-star"[^>]*>([^<]+)</);
    const rank = starsMatch ? starsMatch[1].trim() : FALLBACK_DATA.codechef.rank;
    
    // Extract solved
    const solvedMatch = html.match(/Total Problems Solved:[^0-9]*([0-9]+)/i) || html.match(/Fully Solved[^0-9]*([0-9]+)/i);
    const solved = solvedMatch ? parseInt(solvedMatch[1]) : FALLBACK_DATA.codechef.solved;
    
    return { username, solved, rating, rank };
  } catch (e) {
    return FALLBACK_DATA.codechef;
  }
}

async function getGFG(username: string) {
  try {
    const res = await fetch(`https://www.geeksforgeeks.org/profile/${username}`, { next: { revalidate: 3600 } });
    const html = await res.text();
    
    // Simple regex matching for GFG structure since it changes often
    const scoreMatch = html.match(/Overall Coding Score.*?(\d+)/i);
    const solvedMatch = html.match(/Problems Solved.*?(\d+)/i);
    
    return {
      username,
      solved: solvedMatch ? parseInt(solvedMatch[1]) : FALLBACK_DATA.gfg.solved,
      rating: scoreMatch ? parseInt(scoreMatch[1]) : FALLBACK_DATA.gfg.rating,
      rank: FALLBACK_DATA.gfg.rank
    };
  } catch (e) {
    return FALLBACK_DATA.gfg;
  }
}

async function getHackerRank(username: string) {
  try {
    const res = await fetch(`https://www.hackerrank.com/rest/hackers/${username}/badges`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const badgesCount = data?.models?.length || 0;
    
    return {
      username,
      solved: FALLBACK_DATA.hackerrank.solved,
      rating: FALLBACK_DATA.hackerrank.rating,
      rank: `${badgesCount} Badges`
    };
  } catch (e) {
    return FALLBACK_DATA.hackerrank;
  }
}

export async function GET() {
  const [leetcode, codeforces, codechef, gfg, hackerrank] = await Promise.all([
    getLeetCode('_sakshi19_'),
    getCodeforces('sakshi_190819'),
    getCodeChef('sakshi_200306'),
    getGFG('sakshisrivasq50o'),
    getHackerRank('sakshisrivasta41')
  ]);

  // Safely sum solved counts, ignoring "N/A"
  const safeSum = (...values: unknown[]) => values.reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0);
  const totalSolved = safeSum(leetcode.solved, codeforces.solved, codechef.solved, gfg.solved);

  return NextResponse.json({
    platforms: { leetcode, codeforces, codechef, gfg, hackerrank },
    totalSolved
  });
}
