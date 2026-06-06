import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const agentUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8000';
    const response = await fetch(`${agentUrl}/analyze/${address}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent data' },
      { status: 500 }
    );
  }
}
