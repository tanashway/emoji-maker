import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return url.trim().length > 0;
  } catch {
    return false;
  }
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not set');
      return NextResponse.json(
        { error: "API configuration error. Please check server configuration." },
        { status: 500 }
      );
    }

    console.log('Starting emoji generation with prompt:', prompt);
    
    try {
      const prediction = await replicate.predictions.create({
        version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
        input: {
          width: 1024,
          height: 1024,
          prompt: `emoji style ${prompt}, simple, cute, minimal, solid color background, centered`, 
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "text, watermark, signature, blurry, low quality, realistic, photographic, photograph, multiple objects",
          prompt_strength: 0.8,
          num_inference_steps: 50
        }
      });

      console.log('Prediction created:', prediction);

      // Wait for the prediction to complete
      let output = await replicate.wait(prediction);
      console.log('Raw output from Replicate:', JSON.stringify(output, null, 2));

      if (!output || !output.output) {
        console.error('No output received from Replicate');
        return NextResponse.json(
          { error: "No output received from image generation service." },
          { status: 500 }
        );
      }

      // The output.output field should contain the array of image URLs
      const outputArray = Array.isArray(output.output) ? output.output : [output.output];
      console.log('Image URLs:', outputArray);

      // Validate the output and ensure we have valid URLs
      const validImages = outputArray.filter(isValidUrl);
      console.log('Valid images after filtering:', validImages);

      if (validImages.length === 0) {
        console.error('No valid images in output. Raw output:', output);
        return NextResponse.json(
          { error: "No valid images were generated. Please try a different prompt." },
          { status: 500 }
        );
      }

      return NextResponse.json({ images: validImages });
    } catch (replicateError) {
      console.error('Replicate API error:', replicateError);
      return NextResponse.json(
        { error: "Error communicating with image generation service. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error generating emoji:', errorMessage);
    return NextResponse.json(
      { error: "Failed to generate emoji. Please try again with a different prompt." },
      { status: 500 }
    );
  }
} 