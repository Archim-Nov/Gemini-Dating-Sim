
export type PersonalityType = 'Shy' | 'Outgoing' | 'Intellectual' | 'Artistic' | 'Sassy' | 'Kind' | 'Mysterious';

export interface Character {
    id: string;
    name: string;
    age: number;
    occupation: string;
    personality: PersonalityType;
    bio: string;
    interests: string[];
    avatarUrl: string;
    affinity: number; // A score from 0 to 100
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'npc';
    timestamp: string;
}
