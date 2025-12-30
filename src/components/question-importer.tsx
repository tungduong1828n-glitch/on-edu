'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ClipboardList } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Props {
    onImport: (data: any[]) => void;
}

export function QuestionImporter({ onImport }: Props) {
    const [open, setOpen] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');

    const parseAndImport = (text: string) => {
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
                onImport(json);
                setOpen(false);
                setJsonText('');
                setError('');
            } else {
                setError('Invalid JSON format: Root must be an array');
            }
        } catch (error) {
            setError('Error parsing JSON');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            parseAndImport(event.target?.result as string);
        };
        reader.readAsText(file);
    };

    const handlePasteImport = () => {
        if (!jsonText.trim()) return;
        parseAndImport(jsonText);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer border-dashed border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                    <Upload className="w-4 h-4 mr-2 text-cyan-500" />
                    Import JSON
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Questions</DialogTitle>
                    <DialogDescription>
                        Import questions from a JSON file or paste the content directly.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="paste" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="paste">Paste Text</TabsTrigger>
                        <TabsTrigger value="file">Upload File</TabsTrigger>
                    </TabsList>

                    <TabsContent value="paste" className="space-y-4 py-4">
                        <Textarea
                            placeholder='[{"text": "Question...", "answer": "..."}]'
                            className="min-h-[200px] font-mono text-sm"
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button onClick={handlePasteImport} className="w-full">
                            <ClipboardList className="w-4 h-4 mr-2" />
                            Import Text
                        </Button>
                    </TabsContent>

                    <TabsContent value="file" className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/20">
                            <FileText className="w-10 h-10 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">Select a .json file from your computer</p>
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="file-upload">
                                <Button variant="secondary" className="cursor-pointer" asChild>
                                    <span>Select File</span>
                                </Button>
                            </label>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

