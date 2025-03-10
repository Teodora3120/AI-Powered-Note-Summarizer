import axios from 'axios';

export class NotesApi {
    private url: string;

    constructor() {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        if (!backendUrl) {
            throw new Error("REACT_APP_BACKEND_URL env var is not set.")
        }

        this.url = backendUrl;
    }


    public async handleSaveNote(noteText: string) {
        try {
            const response = await axios.post(`${this.url}/api/notes/save`, { noteText });
            return response.data;
        } catch (error) {
            console.error("Error saving note", error);
        }
    };

    /**
     * Handles generating summary
     * @param noteText 
     * @returns 
     */
    public async handleGenerateSummary(noteText: string) {
        try {
            const response = await axios.post(`${this.url}/api/notes/summarize`, { noteText })
            return response.data;
        } catch (error) {
            console.error("Error generating summary", error);
        }
    };
}