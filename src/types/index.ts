export type BlockType = 'header' | 'text' | 'subtitle' | 'image' | 'grid' | 'link' | 'video' | 'model3d';

export interface BlockButton {
    text: string;
    text_en?: string; // English translation
    url: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    iconUrl?: string;
}

export interface Block {
    id: string;
    type: BlockType;
    content: string; // Text content or Image URL
    content_en?: string; // English translation for content
    altText?: string; // Alt text for image blocks
    altText_en?: string; // English translation for altText
    width?: number; // Image width
    height?: number; // Image height
    items?: string[]; // For grids (array of image URLs)
    itemAlts?: string[]; // Alt text for grid items
    itemAlts_en?: string[]; // English translation for itemAlts
    linkUrl?: string; // For link blocks
    linkText?: string; // For link blocks
    linkText_en?: string; // English translation for linkText
    linkColor?: string; // Color for inline links in text content
    bgColor?: string; // Background color for button
    textColor?: string; // Text color for button
    borderColor?: string; // Border color for button
    iconUrl?: string; // Icon URL for button (e.g., favicon)
    textureUrl?: string; // For 3D models
    buttons?: BlockButton[]; // For multiple buttons
    noBorder?: boolean; // Option to remove border from images/grids
    pixelate?: boolean; // Whether to use nearest neighbor interpolation
}

export interface Post {
    id: string;
    title: string;
    title_en?: string; // English translation
    slug?: string;
    date: string;
    thumbnail: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    thumbnailModel?: string; // URL for 3D model thumbnail
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
    category_en?: string; // English translation
    active?: boolean; // Whether the post is active/visible (default: true)
    order?: number; // Custom sort order
    usePostBackgroundForCard?: boolean; // Use post background for card
    textColor?: string; // Global text color for the post content
    thumbnail3dBackgroundColor?: string; // Background color specifically for 3D thumbnail container
}
