export const formatStreamingText = (text: string) => {
  let cleanedText = text
    .replace(/^"|"$/g, "") // Remove first and last quotes
    .replace(/\\boxed{([^{}]*)}/g, "$1") // Remove \boxed{}
    .replace(/^"|"$/g, "")
    .replace(/\n\s*'\+\s*'/g, "\n") // Fix JS string artifacts
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold **text**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics *text*
    .replace(/_(.*?)_/g, "<u>$1</u>") // Underline _text_
    .replace(
      /`([^`]+)`/g,
      "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm text-red-600'>$1</code>"
    ) // Inline code
    .replace(/^# (.*$)/gm, "<h1 class='text-2xl font-bold'>$1</h1>") // # Header 1
    .replace(/^## (.*$)/gm, "<h2 class='text-xl font-semibold'>$1</h2>") // ## Header 2
    .replace(/^### (.*$)/gm, "<h3 class='text-lg font-medium'>$1</h3>") // ### Header 3
    .replace(
      /^\s*>\s*(.*)$/gm,
      "<blockquote class='border-l-4 border-gray-300 pl-4 italic'>$1</blockquote>"
    ) // Blockquotes
    // .replace(/(\d+)\.\s+(.*)/g, "<li class='list-decimal ml-5'>$2</li>") // Numbered lists
    .replace(
      /(\d+)\.\s+(.*?)(?=\n\d+\.|\n\n|$)/g,
      "<li class='list-decimal ml-5'>$2</li>"
    )

    .replace(/^- (.*)/gm, "<li class='list-disc ml-5'>$1</li>") // Bullet lists
    .replace(/\n{2,}/g, "<br><br>") // Extra spacing
    .replace(/\n/g, "<br>") // Line breaks
    .replace(
      /```([\w]+)?\n([\s\S]*?)```/g,
      `<pre class='bg-gray-900 text-white p-4 rounded-md overflow-x-auto'><code class='language-$1'>$2</code></pre>`
    ) // Code Blocks
    .replace(/\$\$(.*?)\$\$/g, "<span class='math-block'>$$$1$$</span>") // Block Math
    .replace(/\$(.*?)\$/g, "<span class='math-inline'>$1</span>"); // Inline Math

  // Wrap lists in <ul> or <ol>
  cleanedText = cleanedText.replace(
    /(<li class='list-disc.*?<\/li>)/g,
    "<ul class='list-outside'>$1</ul>"
  );
  cleanedText = cleanedText.replace(
    /(<li class='list-decimal.*?<\/li>)/g,
    "<ol class='list-outside'>$1</ol>"
  );

  return cleanedText.trim();
};
