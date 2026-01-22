'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/emoji-favicon-generator.ts';
import '@/ai/flows/privacy-policy-flow.ts';
import '@/ai/flows/terms-and-conditions-flow.ts';
import '@/ai/flows/refund-policy-flow.ts';
import '@/ai/flows/return-policy-flow.ts';
