#!/usr/bin/env python3
"""
TerraSense Inference Demo

A simple demo script for testing TerraSense model inference.
Note: This model requires BOTH image(s) AND text prompt as input.

Usage:
    # Single image
    python examples/inference_demo.py --image path/to/image.jpg --prompt "Describe this remote sensing image"
    
    # Bi-temporal change detection (two images)
    python examples/inference_demo.py --image before.jpg --image2 after.jpg \
        --prompt "Identify the locations and categories of changed areas between these two images"

"""

import argparse
import os
import sys

import torch
from transformers import AutoModelForVision2Seq, AutoProcessor
from qwen_vl_utils import process_vision_info


# Training configuration constants (keep consistent with training)
IMAGE_MAX_PIXELS = 4194304  # ~2048x2048
IMAGE_MIN_PIXELS = 256 * 28 * 28  # minimum pixels


def parse_args():
    parser = argparse.ArgumentParser(
        description="TerraSense Inference Demo (requires image + text prompt)"
    )
    parser.add_argument(
        "--model",
        type=str,
        default="TerraSense-CASM/TerraSense-Base",
        help="Model path (HuggingFace repo or local path)",
    )
    parser.add_argument(
        "--image",
        type=str,
        required=True,
        help="Path to first image file or URL (required)",
    )
    parser.add_argument(
        "--image2",
        type=str,
        default=None,
        help="Path to second image for bi-temporal change detection (optional)",
    )
    parser.add_argument(
        "--prompt",
        type=str,
        required=True,
        help="Text prompt for the model (required)",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=512,
        help="Maximum number of tokens to generate",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.1,
        help="Sampling temperature (lower = more deterministic)",
    )
    parser.add_argument(
        "--top-p",
        type=float,
        default=0.9,
        help="Top-p (nucleus) sampling",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="cuda" if torch.cuda.is_available() else "cpu",
        help="Device to run inference on",
    )
    return parser.parse_args()


def validate_image_path(image_path: str) -> bool:
    """Validate image path exists (skip validation for URLs)."""
    if image_path.startswith(("http://", "https://")):
        return True
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        return False
    return True


def load_model(model_path: str, device: str):
    """Load model and processor."""
    print(f"Loading model from: {model_path}")
    print(f"Device: {device}")
    
    dtype = torch.bfloat16 if device == "cuda" else torch.float32
    
    model = AutoModelForVision2Seq.from_pretrained(
        model_path,
        torch_dtype=dtype,
        device_map="auto" if device == "cuda" else None,
        trust_remote_code=True,
    )
    
    if device != "cuda":
        model = model.to(device)
    
    processor = AutoProcessor.from_pretrained(model_path, trust_remote_code=True)
    
    # Set image processing parameters consistent with training
    if hasattr(processor, 'image_processor'):
        processor.image_processor.max_pixels = IMAGE_MAX_PIXELS
        processor.image_processor.min_pixels = IMAGE_MIN_PIXELS
    
    print("Model loaded successfully!\n")
    return model, processor


def run_inference(
    model, processor, image_path: str, image2_path: str, 
    prompt: str, max_tokens: int, temperature: float, top_p: float
):
    """Run inference with the model."""
    # Validate image paths
    if not validate_image_path(image_path):
        sys.exit(1)
    if image2_path and not validate_image_path(image2_path):
        sys.exit(1)
    
    # Print input info
    print(f"Image 1: {image_path}")
    if image2_path:
        print(f"Image 2: {image2_path}")
        print("Mode: Bi-temporal Change Detection")
    else:
        print("Mode: Single Image")
    print(f"Prompt: {prompt}\n")
    
    # Build message content
    content = [{"type": "image", "image": image_path}]
    if image2_path:
        content.append({"type": "image", "image": image2_path})
    content.append({"type": "text", "text": prompt})
    
    messages = [{"role": "user", "content": content}]
    
    # Process inputs
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image_inputs, video_inputs = process_vision_info(messages)
    
    inputs = processor(
        text=[text],
        images=image_inputs,
        videos=video_inputs,
        padding=True,
        return_tensors="pt",
    )
    
    # Move to device
    device = next(model.parameters()).device
    inputs = inputs.to(device)
    
    # Generate
    print("Generating response...")
    with torch.no_grad():
        generated_ids = model.generate(
            **inputs, 
            max_new_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=temperature > 0,
        )
    
    # Trim input tokens to get only the generated output
    generated_ids_trimmed = [
        out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]
    
    output_text = processor.batch_decode(
        generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
    )
    
    return output_text[0]


def main():
    args = parse_args()
    
    print("=" * 60)
    print("TerraSense Inference Demo")
    print("=" * 60 + "\n")
    
    # Load model
    model, processor = load_model(args.model, args.device)
    
    # Run inference
    response = run_inference(
        model, processor, 
        args.image, args.image2, args.prompt, 
        args.max_tokens, args.temperature, args.top_p
    )
    
    print("-" * 60)
    print("Response:")
    print("-" * 60)
    print(response)
    print("-" * 60)


if __name__ == "__main__":
    main()
