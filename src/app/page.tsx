'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import { Message } from './types';
import { gateway } from './lib/gateway';
import { toast } from 'react-hot-toast';
import { generateId } from './lib/utils';
