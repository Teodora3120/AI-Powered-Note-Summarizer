import axios from "axios";

export class NotesApi {
  private url: string;

  constructor() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("REACT_APP_BACKEND_URL env var is not set.");
    }

    this.url = backendUrl;
  }

  public async handleSaveNote(summary: string) {
    try {
      const response = await axios.post(`${this.url}/api/v1/notes/save`, {
        summary,
      });
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      throw new Error(errMsg);
    }
  }

  public async getNotes() {
    try {
      const response = await axios.get(`${this.url}/api/v1/notes/`);
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      throw new Error(errMsg);
    }
  }

  public async handleDeleteNote(id: Number) {
    try {
      const response = await axios.delete(`${this.url}/api/v1/notes/${id}`);
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      throw new Error(errMsg);
    }
  }

  public async handleGenerateSummary(
    noteText: string,
    temperature: number,
    length: string,
    tone: string,
    onStreamUpdate: (chunk: string) => void,
    signal?: AbortSignal
  ) {
    try {
      const response = await fetch(`${this.url}/api/v1/notes/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText, temperature, length, tone }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      if (!response.body) {
        throw new Error("No response body from server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        onStreamUpdate(chunk);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted.");
        return;
      }
      const errMsg = error.response?.data?.error || error.message;
      throw new Error(errMsg);
    }
  }
}
