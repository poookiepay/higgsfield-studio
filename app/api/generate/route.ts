import { NextResponse } from 'next/server';
import { higgsfield } from '@higgsfield/client/v2';

export async function POST(req: Request) {
  try {
    const { prompt, duration, resolution, aspectRatio } = await req.json();

    if (!process.env.HF_CREDENTIALS) {
      return NextResponse.json({ error: 'API Credentials missing' }, { status: 500 });
    }

    const result = await higgsfield.subscribe(
      'bytedance/seedance-2.5/text-to-video',
      {
        input: {
          prompt,
          duration: Number(duration) || 5,
          resolution: resolution || '720p',
          aspect_ratio: aspectRatio || '16:9',
          output_format: 'mp4',
          generate_audio: true,
        },
        withPolling: true,
      }
    );

    if (!result.isCompleted) {
      return NextResponse.json({ error: 'Video generation failed' }, { status: 500 });
    }

    const videoUrl = result.jobs[0]?.results?.raw?.url;
    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
