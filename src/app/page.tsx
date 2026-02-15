'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { Loader2, Code2, GitBranch } from 'lucide-react';

const FlowChart = dynamic(() => import('@/components/FlowChart'), { ssr: false });

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [flowData, setFlowData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setFlowData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Try to parse JSON from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const jsonStr = line.slice(2).trim();
              const parsed = JSON.parse(jsonStr);
              if (parsed.nodes && parsed.edges) {
                setFlowData(parsed);
              }
            } catch (e) {
              // Keep accumulating
            }
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <GitBranch className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              CodeFlow
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform complex code into interactive flowcharts with AI-powered analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Code Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="font-mono text-sm min-h-[400px] resize-none"
              />

              <Button
                onClick={analyzeCode}
                disabled={isAnalyzing || !code.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Code'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Visual Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {!flowData && !isAnalyzing && (
                <div className="flex items-center justify-center h-[480px] text-slate-400">
                  <div className="text-center">
                    <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your flowchart will appear here</p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex items-center justify-center h-[480px]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-slate-600">Analyzing your code...</p>
                  </div>
                </div>
              )}

              {flowData && (
                <Tabs defaultValue="flowchart" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="flowchart" className="mt-4">
                    <div className="h-[440px] border rounded-lg bg-white dark:bg-slate-950">
                      <FlowChart data={flowData} />
                    </div>
                  </TabsContent>

                  <TabsContent value="insights" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {flowData.summary}
                        </p>
                      </CardContent>
                    </Card>

                    {flowData.complexity && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Complexity Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cyclomatic Complexity</span>
                            <Badge variant={flowData.complexity.cyclomatic > 10 ? 'destructive' : 'default'}>
                              {flowData.complexity.cyclomatic}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cognitive Complexity</span>
                            <Badge variant={flowData.complexity.cognitive > 15 ? 'destructive' : 'default'}>
                              {flowData.complexity.cognitive}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Flow Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Total Nodes</span>
                          <Badge variant="outline">{flowData.nodes?.length || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Connections</span>
                          <Badge variant="outline">{flowData.edges?.length || 0}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
