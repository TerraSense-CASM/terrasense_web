# 🌍 TerraSense: All-In-One Remote Sensing MLLM

<div align="center">
<!-- TODO: Replace with your actual logo if you have one -->
<!-- <img src="assets/logo.png" width="200"/> -->
<br />

<a href="https://huggingface.co/TerraSense-CASM/TerraSense-Base"><img src="https://img.shields.io/badge/🤗_HuggingFace-Model-yellow"></a>
<a href="https://github.com/TerraSense-CASM/TerraSense/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue"></a>
<a href="#"><img src="https://img.shields.io/badge/Task-Detection%20|%20VQA%20|%20Change-green"></a>
<a href="#"><img src="https://img.shields.io/badge/Version-Base-blueviolet"></a>

<!-- TODO: Add actual links when available -->
[🏠 Homepage](#) | [📄 Technical Report](#) | [🤗 Hugging Face](#) | [☁️ Baidu Cloud](#)

</div>

## 📖 Introduction (简介)

TerraSense is a specialized Multimodal Large Language Model (MLLM) designed for remote sensing (RS) imagery interpretation.

While general-purpose VLMs have demonstrated impressive capabilities, they often lack the domain-specific knowledge required for fine-grained geospatial analysis, such as identifying oriented objects, understanding complex land-cover semantics, and reasoning about bi-temporal changes. TerraSense bridges this gap.

In this repository, we release TerraSense-Base, the foundation of our work. It leverages TS-Instruct, a high-quality dataset of 300k+ expert-verified instructions, and is trained via a robust Supervised Fine-Tuning (SFT) pipeline. Unlike standard VLMs, TerraSense-Base offers unique support for bi-temporal change reasoning and oriented bounding box (OBB) detection (output as coordinates).

## 🌟 Core Highlights

- **Unified Paradigm**: Integrates perception (detection) and cognition (QA/Captioning) into one model.
- **Geospatial Intelligence**: Enhanced ability to understand spatial coordinates, relative positions, and dense object clusters in overhead imagery.
- **Expert Knowledge**: Built on expert-verified data to minimize hallucinations in professional RS tasks.

## 📅 Roadmap (路线图)

We are continuously improving TerraSense. The current release is the SFT Base version. Future updates will include:

- [x] TerraSense-Base: SFT on TS-Instruct (Current Release).
- [ ] TerraSense-RFT: Incorporating Reinforcement Fine-Tuning for enhanced reasoning reliability (Coming with Paper).
- [ ] TerraSense-Mask: Support for pixel-level dense prediction and segmentation (Coming with Paper).

## 📚 Data Sources (数据来源)

TerraSense is trained on TS-Instruct, a massive, high-quality instruction-tuning dataset derived from 21 public remote sensing datasets and processed with expert verification.

Our training corpus covers diverse tasks including object detection, semantic segmentation, scene classification, captioning, VQA, and change detection.

<details>
<summary><b>👉 Click to view the full list of supported datasets (21 Datasets)</b></summary>

| Task Category | Datasets Included |
|---------------|-------------------|
| Object Detection | DIOR (Optical RS), DOTA (Aerial OBB), NWPU VHR-10 |
| Segmentation / Extraction | WHU Building, Inria Aerial (Building), LoveDA (Land-cover), LoveDA Mask |
| Scene Classification | NWPU-RESISC45, Sydney, WHU-RS19 |
| Image Captioning / Matching | RSICD, RSITMD, CapERA (Earth RS Analysis) |
| Visual Question Answering (VQA) | RSVQA-HR (High Res), RSVQA-LR (Low Res) |
| Visual Grounding | RSVG (Remote Sensing Visual Grounding) |
| Change Detection (Binary) | Levir-CD (Building), CDD, LIM-CD (Multi-change) |
| Change Detection (Semantic) | SECOND (Semantic Change), Hi-UCD (Urban Change) |

</details>

> **Note**: The dataset has been reformatted into a unified instruction-following format (TS-Instruct) to train the multimodal capabilities of TerraSense.

## 🚀 Quick Start (快速开始)

### 1. Installation

We recommend using a fresh environment with Python 3.10+.

```bash
git clone https://github.com/TerraSense-CASM/TerraSense.git
cd TerraSense

# Install core dependencies for inference and vLLM serving
pip install -r requirements.txt
```

### 2. Inference (Python Script)

You can run a quick test using our provided demo script (requires both image and text prompt):

```bash
# Single image: describe the scene
python examples/inference_demo.py --image path/to/rs_image.jpg --prompt "Describe this remote sensing image"

# Bi-temporal change detection: two images
python examples/inference_demo.py --image path/to/before.jpg --image2 path/to/after.jpg \
    --prompt "Identify the locations and categories of changed areas between these two images"
```

Or use the following code snippet:

**Single Image Inference:**

```python
from transformers import AutoModelForVision2Seq, AutoProcessor
from qwen_vl_utils import process_vision_info
import torch

# Load Model
model_path = "TerraSense-CASM/TerraSense-Base"
model = AutoModelForVision2Seq.from_pretrained(
    model_path, torch_dtype=torch.bfloat16, device_map="auto", trust_remote_code=True
)
processor = AutoProcessor.from_pretrained(model_path, trust_remote_code=True)

# Prepare Input (single image)
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": "assets/example_rs.jpg"},
            {"type": "text", "text": "Describe this remote sensing image."},
        ],
    }
]

# Inference
text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
image_inputs, video_inputs = process_vision_info(messages)
inputs = processor(
    text=[text],
    images=image_inputs,
    padding=True,
    return_tensors="pt",
).to("cuda")

generated_ids = model.generate(**inputs, max_new_tokens=512)
generated_ids_trimmed = [
    out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
]
output_text = processor.batch_decode(
    generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
)
print(output_text[0])
```

**Bi-temporal Change Detection:**

```python
# Prepare Input (two images for change detection)
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": "assets/before.jpg"},
            {"type": "image", "image": "assets/after.jpg"},
            {"type": "text", "text": "Identify the locations and categories of changed areas between these two images."},
        ],
    }
]

# Inference (same as above)
text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
image_inputs, video_inputs = process_vision_info(messages)
inputs = processor(
    text=[text],
    images=image_inputs,
    padding=True,
    return_tensors="pt",
).to("cuda")

generated_ids = model.generate(**inputs, max_new_tokens=512)
generated_ids_trimmed = [
    out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
]
output_text = processor.batch_decode(
    generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
)
print(output_text[0])
```

### 3. Serve with vLLM (Production Recommended)

TerraSense is fully compatible with vLLM for high-concurrency production deployment.

**Single GPU:**

```bash
vllm serve TerraSense-CASM/TerraSense-Base \
    --served-model-name TerraSense-Base \
    --enable-prefix-caching \
    --max-model-len 16384 \
    --host 0.0.0.0 \
    --port 8000 \
    --gpu-memory-utilization 0.9
```

**Multi-GPU (Tensor Parallel):**

```bash
CUDA_VISIBLE_DEVICES=0,1 vllm serve TerraSense-CASM/TerraSense-Base \
    --served-model-name TerraSense-Base \
    --tensor-parallel-size 2 \
    --enable-prefix-caching \
    --max-model-len 16384 \
    --host 0.0.0.0 \
    --port 8000 \
    --gpu-memory-utilization 0.8
```

**Call the API:**

```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "TerraSense-Base",
        "messages": [{"role": "user", "content": [
            {"type": "image_url", "image_url": {"url": "https://example.com/rs_image.jpg"}},
            {"type": "text", "text": "Describe this remote sensing image."}
        ]}]
    }'
```

## 🛠️ Fine-tuning with LLaMA-Factory

TerraSense-Base can serve as a strong foundation for domain-specific fine-tuning. We recommend using the [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) framework for custom SFT on your own datasets.

### Recommended Hyperparameters

| Parameter | Recommended Value | Notes |
|-----------|-------------------|-------|
| Base Model | `TerraSense-CASM/TerraSense-Base` | Use as starting checkpoint |
| Stage | SFT (Full or LoRA) | LoRA for limited GPU; Full for best performance |
| Vision Tower | Frozen | **Critical**: Keep frozen to preserve RS visual features |
| Multi-modal Projector | Frozen | Keep frozen for stable training |
| Sequence Length | 8,192 ~ 16,384 | Adjust based on your data complexity |
| Learning Rate | 1e-5 | With cosine scheduler and 0.1 warmup ratio |
| Batch Size | 8 ~ 16 | Effective batch size (per_device × accumulation) |
| Mixed Precision | BF16 | Recommended for stability |
| Flash Attention | FA2 | Enable for memory efficiency |

### Example LLaMA-Factory Config

```yaml
# Save as: examples/terrasense_sft.yaml

### model
model_name_or_path: TerraSense-CASM/TerraSense-Base
image_max_pixels: 4194304
video_max_pixels: 16384
trust_remote_code: true

### method
stage: sft
do_train: true
finetuning_type: full  # or 'lora' for limited GPU memory
freeze_vision_tower: true
freeze_multi_modal_projector: true
deepspeed: examples/deepspeed/ds_z3_config.json  # optional, for multi-GPU

### dataset
dataset: your_custom_dataset
template: <your_template>  # choose based on your base model 
cutoff_len: 16384
preprocessing_num_workers: 32
dataloader_num_workers: 16

### output
output_dir: ./output/terrasense_custom
logging_steps: 10
save_steps: 500
plot_loss: true

### train
per_device_train_batch_size: 1
gradient_accumulation_steps: 16
learning_rate: 1.0e-5
num_train_epochs: 3.0
lr_scheduler_type: cosine
warmup_ratio: 0.1
bf16: true
flash_attn: fa2
```

> **Tips**:
> - Choose `template` based on your model architecture (check LLaMA-Factory docs for available templates)
> - For best results, format your custom dataset following the TS-Instruct schema (multi-turn conversation with image references)
> - Use DeepSpeed ZeRO-3 for multi-GPU training with large batch sizes

## 📜 License & Disclaimer

**Code License**  
The code in this repository is released under the **Apache 2.0 License**.

**Model Weights**  
The model weights are derived from Qwen-VL and fine-tuned on public remote sensing datasets.

> ⚠️ **Disclaimer**: The source datasets (e.g., DOTA, DIOR, Levir-CD) are publicly available for academic research, but most do not have explicit commercial licensing terms. Users are responsible for ensuring compliance with any applicable dataset licenses.

**Recommended Use**: Research & Academic purposes.
