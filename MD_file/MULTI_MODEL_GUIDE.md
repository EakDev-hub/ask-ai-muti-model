# Multi-Model Query & Summarization Guide

## Overview

The Multi-Model Query feature allows you to send a single query to multiple AI models simultaneously (2-4 models) and then use a selected model to summarize and synthesize their responses into one comprehensive answer.

## Why Use Multi-Model Queries?

- **Diverse Perspectives**: Get different viewpoints and approaches from various AI models
- **Quality Comparison**: Compare responses to identify the most accurate or helpful answer
- **Comprehensive Analysis**: Leverage the strengths of different models for complex questions
- **Better Decision Making**: Make informed choices based on multiple expert opinions
- **Synthesis**: Combine the best insights from all models into one unified response

## How to Use

### Step 1: Enable Multi-Model Mode

1. Click the **🔀 Multi-Model** button in the header
2. The button will turn white and show **🔀 Multi-Model ON**
3. A model selector panel will appear below the header

### Step 2: Select Models (2-4)

1. In the model selector panel, you'll see checkboxes for all available models
2. Select between **2 and 4 models** by clicking their checkboxes
3. The counter will show your selection (e.g., "2/4")
4. You cannot select more than 4 models

### Step 3: Send Your Query

1. Type your message in the input field
2. Optionally, upload an image by clicking the 📎 icon
3. Click the send button 📤
4. All selected models will be queried in parallel

### Step 4: View Responses

The system will display all model responses in a stacked format:

```
┌─────────────────────────────────────────┐
│ 🤖 AI Multi-Model Response              │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ google/gemini-pro-vision          │ │
│ │ Response from Gemini...             │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ anthropic/claude-3-opus           │ │
│ │ Response from Claude...             │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ✗ openai/gpt-4-vision - Error      │ │
│ │ Failed to get response              │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [Select model...] [📝 Summarize]       │
└─────────────────────────────────────────┘
```

**Success Indicators:**
- ✓ Green checkmark = Model responded successfully
- ✗ Red X = Model failed to respond

### Step 5: Summarize Responses

1. At the bottom of the multi-model response, select a model from the dropdown menu
2. You can choose any of the successfully responding models
3. Click the **📝 Summarize** button
4. The selected model will analyze all responses and create a comprehensive summary

### Step 6: View Summary

The summary appears as a new message with:
- **📋 Summary** badge
- The selected summarizer model name
- A unified, comprehensive answer synthesizing all responses

## Features

### Parallel Processing
All models are queried simultaneously, so you don't wait longer than the slowest model.

### Graceful Error Handling
- If some models fail, successful responses are still displayed
- You can still summarize with the successful responses
- Error messages show which models failed and why

### Smart Model Selection
- By default, the first successful model is pre-selected for summarization
- You can choose any successful model to generate the summary

### Automatic Summary Prompt
The system automatically creates a prompt that:
- Includes all successful model responses
- Asks the summarizer to compare and synthesize the information
- Provides a comprehensive, unified answer

## Best Practices

### When to Use Multi-Model Mode

✅ **Good Use Cases:**
- Complex questions requiring multiple perspectives
- Technical analysis needing verification
- Creative tasks benefiting from diverse approaches
- Fact-checking across different AI models
- Important decisions requiring comprehensive analysis

❌ **Not Recommended For:**
- Simple, straightforward questions
- When you need a quick single answer
- Highly specific queries better suited for one model

### Model Selection Strategy

1. **Diverse Models**: Select models with different strengths
   - Mix vision and language models for image analysis
   - Combine reasoning and creative models for complex tasks

2. **Quality Over Quantity**: 2-3 well-chosen models often better than 4
   - More responses = more to process
   - Focus on complementary strengths

3. **Consider Costs**: More models = higher API costs
   - Check model pricing in OpenRouter
   - Balance cost with information quality

### Summarization Tips

1. **Choose the Right Summarizer**:
   - Use stronger models (Claude Opus, GPT-4) for complex summaries
   - Match summarizer strength to query complexity

2. **Review Individual Responses First**:
   - Check which models provided useful information
   - Understand different perspectives before summarizing

3. **Use System Prompts**:
   - Customize the system prompt for specific summarization needs
   - Example: "Focus on technical accuracy" or "Emphasize creative solutions"

## Example Workflows

### Workflow 1: Image Analysis
```
1. Enable Multi-Model Mode
2. Select: Gemini Pro Vision, GPT-4 Vision, Claude 3 Opus
3. Upload an architectural image
4. Ask: "Analyze this building's architectural style and features"
5. Review all model responses
6. Use Claude 3 Opus to summarize the findings
```

### Workflow 2: Code Review
```
1. Enable Multi-Model Mode
2. Select: Claude 3 Opus, GPT-4, Gemini Pro
3. Paste code snippet
4. Ask: "Review this code for bugs, performance, and best practices"
5. Compare different models' suggestions
6. Summarize with Claude 3 Opus for comprehensive code review
```

### Workflow 3: Research Question
```
1. Enable Multi-Model Mode
2. Select: Claude 3 Opus, GPT-4, Gemini Pro
3. Ask complex research question
4. Review diverse perspectives and evidence
5. Summarize with GPT-4 for balanced synthesis
```

## Troubleshooting

### Issue: Can't Select More Models
**Solution**: Maximum 4 models allowed. Deselect one to add another.

### Issue: Some Models Show Errors
**Possible Causes**:
- Model rate limits reached
- OpenRouter API issues
- Network connectivity problems
- Model doesn't support the query type (e.g., image without vision capability)

**Solution**: 
- Use successful responses
- Try again later
- Check OpenRouter status
- Ensure image queries only use vision-capable models

### Issue: Summary Button Disabled
**Causes**:
- No summary model selected
- All models failed to respond
- Summarization in progress

**Solution**:
- Select a model from the dropdown
- Wait for at least one successful response
- Wait for current summarization to complete

### Issue: Multi-Model Mode Won't Enable
**Causes**:
- Currently loading a response
- System error

**Solution**:
- Wait for current operation to complete
- Refresh the page
- Check browser console for errors

## API Details

### Multi-Model Endpoint
```
POST /api/chat/multi-model
```

**Request:**
```json
{
  "message": "Your question here",
  "image": "base64-encoded-image (optional)",
  "models": ["model1", "model2", "model3"],
  "systemPrompt": "Custom prompt (optional)"
}
```

**Response:**
```json
{
  "responses": [
    {
      "model": "model-id",
      "response": "Response text",
      "usage": { "prompt_tokens": 100, "completion_tokens": 200 },
      "success": true
    }
  ],
  "requestId": "unique-id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Summarization Endpoint
```
POST /api/chat/summarize
```

**Request:**
```json
{
  "responses": [
    {
      "model": "model-id",
      "response": "Response text"
    }
  ],
  "summaryModel": "model-for-summary",
  "systemPrompt": "Custom prompt (optional)"
}
```

**Response:**
```json
{
  "summary": "Summarized response text",
  "model": "model-id",
  "usage": { "prompt_tokens": 500, "completion_tokens": 300 },
  "sourceModels": ["model1", "model2"]
}
```

## Configuration

### Backend Configuration
Location: `backend/src/config.js`

```javascript
multiModel: {
  maxModels: 4,        // Maximum models per query
  minModels: 2,        // Minimum models per query
  timeout: 45000,      // 45 seconds timeout
  defaultSummaryPrompt: "Compare and synthesize..."
}
```

### Customization
You can customize:
- Maximum/minimum model limits
- Timeout duration
- Default summary prompt
- Model filtering logic

## Tips for Advanced Users

1. **Custom Summary Prompts**: Use system prompts to guide summarization
2. **Model Combinations**: Experiment with different model combinations
3. **Error Analysis**: Review error messages to optimize model selection
4. **Performance Monitoring**: Check response times and adjust model choices
5. **Cost Optimization**: Track token usage across models

## Support

For issues or questions:
1. Check the [Technical Specification](./MULTI_MODEL_FEATURE_SPEC.md)
2. Review [Project Documentation](./PROJECT_SUMMARY.md)
3. Check OpenRouter model status
4. Review browser console for errors

## Future Enhancements

Planned features:
- Streaming responses (show each model as it completes)
- Response comparison view (side-by-side)
- Model performance statistics
- Saved model combinations
- Custom summary prompt templates
- Response voting/rating system