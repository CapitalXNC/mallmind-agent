'use client';
import { useState, useRef } from 'react';
import { sendAgentMessage, runScenario } from '../lib/api';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  toolsUsed?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function useAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: 'MallMind online. I have access to live foot traffic, weather data, tenant directory, and can log incidents and trigger campaigns. How can I help you manage the mall?',
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const sessionId = useRef(`session-${Date.now()}`);

  const sendMessage = async (content: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    const loadingMsg: Message = {
      id: `loading-${Date.now()}`,
      role: 'agent',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setIsThinking(true);

    try {
      const result = await sendAgentMessage(content, sessionId.current);
      setMessages(prev => prev.map(m =>
        m.isLoading ? {
          ...m,
          content: result.response,
          toolsUsed: result.toolsUsed,
          isLoading: false,
          id: `agent-${Date.now()}`
        } : m
      ));
    } catch (err: unknown) {
      setMessages(prev => prev.map(m =>
        m.isLoading ? {
          ...m,
          content: `Error: ${getErrorMessage(err)}`,
          isLoading: false,
          id: `error-${Date.now()}`
        } : m
      ));
    } finally {
      setIsThinking(false);
    }
  };

  const triggerScenario = async (scenarioId: string, param?: string) => {
    const label = scenarioId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const userMsg: Message = {
      id: `scenario-user-${Date.now()}`,
      role: 'user',
      content: `Run scenario: ${label}`,
      timestamp: new Date()
    };

    const loadingMsg: Message = {
      id: `loading-${Date.now()}`,
      role: 'agent',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setIsThinking(true);

    try {
      const result = await runScenario(scenarioId, param, `scenario-${Date.now()}`);
      setMessages(prev => prev.map(m =>
        m.isLoading ? {
          ...m,
          content: result.response,
          toolsUsed: result.toolsUsed,
          isLoading: false,
          id: `agent-${Date.now()}`
        } : m
      ));
    } catch (err: unknown) {
      setMessages(prev => prev.map(m =>
        m.isLoading ? {
          ...m,
          content: `Error: ${getErrorMessage(err)}`,
          isLoading: false
        } : m
      ));
    } finally {
      setIsThinking(false);
    }
  };

  return { messages, sendMessage, triggerScenario, isThinking };
}
