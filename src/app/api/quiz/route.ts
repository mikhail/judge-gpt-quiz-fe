import { NextRequest, NextResponse } from "next/server";
import { fetchArticlesForUser, storeUserResponse } from "./quiz.utils";

/**
 * [GET] /api/quiz
 * Returns a set of quiz questions for the user to answer. Returns a message or error.
 * @param req: NextRequest
 * - query: { userUid: string }
 * @returns
 * - status: 200 | 400 | 404 | 500
 * - body: ArticleLocal[] | { error: string }
 */
async function GET(req: NextRequest) {
  try {
    // Get the user ID from query parameters
    const { searchParams } = new URL(req.url);
    if (!searchParams) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }
    const userUid = searchParams.get("userUid");
    const locale = searchParams.get("locale");
    if (!userUid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    if (!locale) {
      return NextResponse.json(
        { error: "Locale is required" },
        { status: 400 }
      );
    }
    if (typeof userUid !== "string") {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }
    if (typeof locale !== "string") {
      return NextResponse.json({ error: "Invalid Locale" }, { status: 400 });
    }

    // Fetch quiz questions for the user from the server
    const questions = await fetchArticlesForUser(userUid);
    if (!questions) {
      return NextResponse.json(
        { error: "Quiz questions not found" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 *
 * @param req: NextRequest
 * - query: {userUid: string}
 * - body: {
 *          articleUid: string,
 *          userRespondedIsHuman: boolean,
 *          userRespondedIsFake: boolean,
 *          timeToRespond: number
 *           }
 * @returns
 * - status: 200 | 400 | 404 | 500
 * - body: { isCorrect: boolean } | { error: string }
 */
async function POST(req: NextRequest) {
  try {
    // Get the user ID from query parameters
    const { searchParams } = new URL(req.url);
    if (!searchParams) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }
    const userUid = searchParams.get("userUid");
    if (!userUid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    if (typeof userUid !== "string") {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    // Get the article ID and user response from the request body
    if (!req.body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    const {
      articleUid,
      userRespondedIsHuman,
      userRespondedIsFake,
      timeToRespond,
    } = await req.json();
    if (!articleUid) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }
    if (typeof articleUid !== "string") {
      return NextResponse.json(
        { error: "Invalid Article ID" },
        { status: 400 }
      );
    }
    if (typeof userRespondedIsHuman !== "boolean") {
      return NextResponse.json(
        { error: "Invalid user response" },
        { status: 400 }
      );
    }
    if (typeof userRespondedIsFake !== "boolean") {
      return NextResponse.json(
        { error: "Invalid user response" },
        { status: 400 }
      );
    }
    if (typeof timeToRespond !== "number") {
      return NextResponse.json(
        { error: "Invalid time to respond" },
        { status: 400 }
      );
    }

    // Store the user's response in the database
    const isCorrect = await storeUserResponse({
      userUid,
      articleUid,
      userRespondedIsHuman,
      userRespondedIsFake,
      timeToRespond,
    });
    if (typeof isCorrect !== "boolean") {
      return NextResponse.json(
        { error: "User response not stored" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json({ isCorrect }, { status: 200 });

    // Error handling
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export { GET, POST };