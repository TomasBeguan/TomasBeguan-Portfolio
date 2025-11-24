export type BlockType = 'header' | 'text' | 'subtitle' | 'image' | 'grid' | 'link' | 'video' | 'model3d';

export interface Block {
    id: string;
    type: BlockType;
    content: string; // Text content or Image URL
    altText?: string; // Alt text for image blocks
    items?: string[]; // For grids (array of image URLs)
    itemAlts?: string[]; // Alt text for grid items
    linkUrl?: string; // For link blocks
    linkText?: string; // For link blocks
    linkColor?: string; // Color for inline links in text content
    bgColor?: string; // Background color for button
    textColor?: string; // Text color for button
    borderColor?: string; // Border color for button
    iconUrl?: string; // Icon URL for button (e.g., favicon)
    textureUrl?: string; // For 3D models
}

export interface Post {
    id: string;
    title: string;
    date: string;
    thumbnail: string;
    blocks: Block[];
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundMode?: 'cover' | 'contain' | 'repeat' | 'no-repeat' | 'stretch';
    backgroundOpacity?: number; // 0-100
    backgroundSize?: string; // e.g. "50%", "cover"
    backgroundBlendMode?: string; // e.g. "multiply", "overlay"
    cardBackgroundColor?: string;
    cardTextColor?: string;
    category?: string;
    active?: boolean; // Whether the post is active/visible (default: true)
    order?: number; // Custom sort order
    usePostBackgroundForCard?: boolean; // Use post background for card
}
