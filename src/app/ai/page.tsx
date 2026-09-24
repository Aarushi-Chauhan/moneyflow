"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { parseTransactionQuery, filterTransactionsByIntent } from "@/lib/ai/nl-parser";
import { getMonthlyCopilotSummary } from "@/lib/ai/context";
import { format, parseISO } from "date-fns";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  component?: React.ReactNode;
};

const SUGGESTED_PROMPTS = [
  "Summarize my financial month",
  "Show my food expenses",
  "Transactions above ₹10,000",
  "How much did I save?",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hi! I'm MoneyFlow AI, your personal financial intelligence assistant. How can I help you analyze your finances today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    // Add user message
    const newMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: newMsgId, role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      generateResponse(text);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const responseMsg: Message = { id: Date.now().toString(), role: "ai", content: "" };

    if (lowerQuery.includes("summarize") || lowerQuery.includes("summary")) {
      const summary = getMonthlyCopilotSummary();
      responseMsg.content = `Here is your monthly summary. ${summary.description}`;
      responseMsg.component = (
        <div className="mt-4 p-4 rounded-xl border border-border/50 bg-card">
          <h3 className="font-semibold text-lg mb-4">Your Month in MoneyFlow</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Income</span>
              <p className="text-xl font-bold tabular-nums text-emerald-500">₹85,000</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Expenses</span>
              <p className="text-xl font-bold tabular-nums text-foreground">₹51,200</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Savings</span>
              <p className="text-xl font-bold tabular-nums text-primary">₹33,800</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Savings Rate</span>
              <p className="text-xl font-bold tabular-nums text-primary">39.7%</p>
            </div>
          </div>
        </div>
      );
    } else if (lowerQuery.includes("save") || lowerQuery.includes("savings")) {
      responseMsg.content = "You saved ₹33,800 this month, which is a 39.7% savings rate. This is up 5.2% from last month!";
    } else {
      // Use NLP parser for transactions
      const intent = parseTransactionQuery(query);
      
      if (Object.keys(intent).length === 0) {
        responseMsg.content = "I couldn't quite understand that query. Try asking about specific spending categories, or transactions above a certain amount.";
      } else {
        const results = filterTransactionsByIntent(intent);
        
        if (results.length === 0) {
          responseMsg.content = "I couldn't find any transactions matching that criteria this month.";
        } else {
          const totalFound = results.reduce((sum, t) => sum + t.amount, 0);
          responseMsg.content = `I found ${results.length} transactions matching your request.`;
          responseMsg.component = (
            <div className="mt-4 border border-border/50 rounded-xl overflow-hidden bg-card">
              <div className="bg-secondary/30 p-3 border-b border-border/50 flex justify-between items-center">
                <span className="font-semibold text-sm">Filtered Results</span>
                <span className="font-bold tabular-nums">{formatCurrency(totalFound)}</span>
              </div>
              <div className="divide-y divide-border/20 max-h-[300px] overflow-y-auto">
                {results.map(txn => (
                  <div key={txn.id} className="p-3 flex justify-between items-center hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        txn.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}>
                        {txn.type === "income" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.merchant}</p>
                        <p className="text-xs text-muted-foreground">{format(parseISO(txn.date), "MMM dd")}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {txn.type === "income" ? "+" : "−"}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }
    }

    setMessages(prev => [...prev, responseMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in-0 duration-500 max-w-4xl mx-auto">
      {/* AI Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">MoneyFlow AI</h1>
            <p className="text-sm text-muted-foreground">Your personal financial intelligence assistant.</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMessages([messages[0]])}>
          <RefreshCcw className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-6 space-y-6 pr-4 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex max-w-[85%] sm:max-w-[75%]",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === "user" 
                  ? "bg-secondary text-secondary-foreground ml-3" 
                  : "bg-primary text-primary-foreground mr-3"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col">
                <div className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === "user" 
                    ? "bg-secondary text-secondary-foreground rounded-tr-sm" 
                    : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
                {msg.component && (
                  <div className="mt-2 animate-in slide-in-from-bottom-2 duration-300">
                    {msg.component}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex w-full justify-start animate-in fade-in duration-300">
            <div className="flex flex-row max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground mr-3 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-card border border-border/50 text-muted-foreground text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="animate-pulse">Analyzing your finances...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border/50 space-y-4">
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="rounded-full flex-shrink-0 bg-background hover:bg-secondary/50 text-xs text-muted-foreground hover:text-foreground border-border/60"
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your money..."
            className="pr-12 py-6 rounded-xl bg-card border-border/60 shadow-sm focus-visible:ring-primary/20 text-base"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4 text-primary-foreground ml-0.5" />
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          MoneyFlow AI analyzes your local data. It does not invent numbers.
        </p>
      </div>
    </div>
  );
}
