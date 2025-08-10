import {
  Heading1, Heading2, Heading3, Type, List, ListOrdered,
  Quote, Code, Minus, Image, Link, Table, Calendar,
  CheckSquare, File, Folder, Settings, User, Users,
  Mail, Phone, MapPin, Hash, Tag, Flame, Bug, Sparkles,
  BookOpen, Clock, Star, Heart, AlertTriangle, Info,
  CheckCircle, XCircle, Zap, Target, Briefcase, Home,
  Search, Filter, Archive, Trash2, Edit, Copy, Share,
  Download, Upload, Database, Server, Cloud, Wifi,
  Smartphone, Monitor, Tablet, Camera, Video, Music,
  Volume2, Bell, MessageCircle, Send, Eye, EyeOff,
  Lock, Unlock, Shield, Key, Globe, Compass, Navigation,
  Map, Coffee, Gift, ShoppingCart, CreditCard, DollarSign,
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
  Award, Medal, Trophy, Gamepad2, Puzzle, Lightbulb,
  Rocket, Palette, Brush, Scissors, Ruler, Grid,
  Layout, Sidebar, Menu, MoreHorizontal, MessageCircleOff , Plus, Minus as MinusIcon
} from 'lucide-react';

const CommandConfig = {
  '/': {
    ghostText: true,
    placeholder: 'Type to filter commands...',
    suggestions: [
      // Text & Headings
      {
        label: 'Heading 1',
        value: 'h1',
        description: 'Large section heading',
        icon: Heading1,
        category: 'text',
        execute: () => {
          console.log('Creating H1 heading');
        }
      },
      {
        label: 'Heading 2',
        value: 'h2',
        description: 'Medium section heading',
        icon: Heading2,
        category: 'text',
        execute: () => {
          console.log('Creating H2 heading');
        }
      },
      {
        label: 'Heading 3',
        value: 'h3',
        description: 'Small section heading',
        icon: Heading3,
        category: 'text',
        execute: () => {
          console.log('Creating H3 heading');
        }
      },
      {
        label: 'Paragraph',
        value: 'paragraph',
        description: 'Regular text block',
        icon: Type,
        category: 'text',
        execute: () => {
          console.log('Creating paragraph');
        }
      },
      {
        label: 'Quote Block',
        value: 'quote',
        description: 'Highlighted quotation',
        icon: Quote,
        category: 'text',
        execute: () => {
          console.log('Creating quote block');
        }
      },

      // Lists
      {
        label: 'Bullet List',
        value: 'ul',
        description: 'Unordered list with bullets',
        icon: List,
        category: 'lists',
        execute: () => {
          console.log('Creating bullet list');
        }
      },
      {
        label: 'Numbered List',
        value: 'ol',
        description: 'Ordered list with numbers',
        icon: ListOrdered,
        category: 'lists',
        execute: () => {
          console.log('Creating numbered list');
        }
      },
      {
        label: 'Todo List',
        value: 'todo',
        description: 'Checklist with checkboxes',
        icon: CheckSquare,
        category: 'lists',
        execute: () => {
          console.log('Creating todo list');
        }
      },

      // Code & Technical
      {
        label: 'Code Block',
        value: 'code',
        description: 'Formatted code snippet',
        icon: Code,
        category: 'code',
        execute: () => {
          console.log('Creating code block');
        }
      },
      {
        label: 'Inline Code',
        value: 'inline-code',
        description: 'Inline code formatting',
        icon: Code,
        category: 'code',
        execute: () => {
          console.log('Creating inline code');
        }
      },

      // Media & Content
      {
        label: 'Image',
        value: 'image',
        description: 'Upload or embed an image',
        icon: Image,
        category: 'media',
        execute: () => {
          console.log('Adding image');
        }
      },
      {
        label: 'Video',
        value: 'video',
        description: 'Embed a video',
        icon: Video,
        category: 'media',
        execute: () => {
          console.log('Adding video');
        }
      },
      {
        label: 'Link',
        value: 'link',
        description: 'Add a hyperlink',
        icon: Link,
        category: 'media',
        execute: () => {
          console.log('Adding link');
        }
      },
      {
        label: 'File',
        value: 'file',
        description: 'Attach a file',
        icon: File,
        category: 'media',
        execute: () => {
          console.log('Adding file attachment');
        }
      },

      // Structure & Layout
      {
        label: 'Table',
        value: 'table',
        description: 'Insert a table',
        icon: Table,
        category: 'layout',
        execute: () => {
          console.log('Creating table');
        }
      },
      {
        label: 'Divider',
        value: 'hr',
        description: 'Horizontal line separator',
        icon: Minus,
        category: 'layout',
        execute: () => {
          console.log('Creating divider');
        }
      },
      {
        label: 'Columns',
        value: 'columns',
        description: 'Multi-column layout',
        icon: Layout,
        category: 'layout',
        execute: () => {
          console.log('Creating columns');
        }
      },

      // Interactive Elements
      {
        label: 'Button',
        value: 'button',
        description: 'Interactive button',
        icon: CheckCircle,
        category: 'interactive',
        execute: () => {
          console.log('Creating button');
        }
      },
      {
        label: 'Calendar Event',
        value: 'calendar',
        description: 'Schedule an event',
        icon: Calendar,
        category: 'interactive',
        execute: () => {
          console.log('Creating calendar event');
        }
      },

      // Charts & Data
      {
        label: 'Bar Chart',
        value: 'bar-chart',
        description: 'Display data as bar chart',
        icon: BarChart3,
        category: 'charts',
        execute: () => {
          console.log('Creating bar chart');
        }
      },
      {
        label: 'Pie Chart',
        value: 'pie-chart',
        description: 'Display data as pie chart',
        icon: PieChart,
        category: 'charts',
        execute: () => {
          console.log('Creating pie chart');
        }
      },

      // Alerts & Callouts
      {
        label: 'Info Callout',
        value: 'info',
        description: 'Information callout box',
        icon: Info,
        category: 'callouts',
        execute: () => {
          console.log('Creating info callout');
        }
      },
      {
        label: 'Warning Callout',
        value: 'warning',
        description: 'Warning callout box',
        icon: AlertTriangle,
        category: 'callouts',
        execute: () => {
          console.log('Creating warning callout');
        }
      },
      {
        label: 'Success Callout',
        value: 'success',
        description: 'Success callout box',
        icon: CheckCircle,
        category: 'callouts',
        execute: () => {
          console.log('Creating success callout');
        }
      },
      {
        label: 'Error Callout',
        value: 'error',
        description: 'Error callout box',
        icon: XCircle,
        category: 'callouts',
        execute: () => {
          console.log('Creating error callout');
        }
      }
    ]
  },

  '@': {
    ghostText: false,
    placeholder: 'Mention someone...',
    suggestions: [
      // Team Members
      {
        label: 'John Doe',
        value: '@johndoe',
        description: 'Frontend Developer - john.doe@company.com',
        icon: User,
        category: 'team',
        execute: (value) => {
          console.log('Mentioning:', value);
        }
      },
      {
        label: 'Jane Smith',
        value: '@janesmith',
        description: 'Backend Developer - jane.smith@company.com',
        icon: User,
        category: 'team',
        execute: (value) => {
          console.log('Mentioning:', value);
        }
      },
      {
        label: 'Alex Johnson',
        value: '@alexjohnson',
        description: 'UI/UX Designer - alex.johnson@company.com',
        icon: User,
        category: 'team',
        execute: (value) => {
          console.log('Mentioning:', value);
        }
      },
      {
        label: 'Sarah Wilson',
        value: '@sarahwilson',
        description: 'Product Manager - sarah.wilson@company.com',
        icon: User,
        category: 'team',
        execute: (value) => {
          console.log('Mentioning:', value);
        }
      },

      // Teams & Groups
      {
        label: 'Development Team',
        value: '@dev-team',
        description: 'All developers',
        icon: Users,
        category: 'groups',
        execute: (value) => {
          console.log('Mentioning team:', value);
        }
      },
      {
        label: 'Design Team',
        value: '@design-team',
        description: 'UI/UX designers',
        icon: Users,
        category: 'groups',
        execute: (value) => {
          console.log('Mentioning team:', value);
        }
      },
      {
        label: 'Product Team',
        value: '@product-team',
        description: 'Product managers and analysts',
        icon: Users,
        category: 'groups',
        execute: (value) => {
          console.log('Mentioning team:', value);
        }
      },
      {
        label: 'QA Team',
        value: '@qa-team',
        description: 'Quality assurance team',
        icon: Users,
        category: 'groups',
        execute: (value) => {
          console.log('Mentioning team:', value);
        }
      },

      // Departments
      {
        label: 'Marketing',
        value: '@marketing',
        description: 'Marketing department',
        icon: TrendingUp,
        category: 'departments',
        execute: (value) => {
          console.log('Mentioning department:', value);
        }
      },
      {
        label: 'Sales',
        value: '@sales',
        description: 'Sales department',
        icon: DollarSign,
        category: 'departments',
        execute: (value) => {
          console.log('Mentioning department:', value);
        }
      },
      {
        label: 'Support',
        value: '@support',
        description: 'Customer support team',
        icon: MessageCircle,
        category: 'departments',
        execute: (value) => {
          console.log('Mentioning department:', value);
        }
      }
    ]
  },

  '#': {
    ghostText: true,
    placeholder: 'Add a tag...',
    suggestions: [
      // Priority Tags
      {
        label: 'urgent',
        value: '#urgent',
        description: 'High priority item',
        icon: Flame,
        category: 'priority',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },
      {
        label: 'high-priority',
        value: '#high-priority',
        description: 'High priority task',
        icon: AlertTriangle,
        category: 'priority',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },
      {
        label: 'low-priority',
        value: '#low-priority',
        description: 'Low priority task',
        icon: Clock,
        category: 'priority',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },

      // Status Tags
      {
        label: 'in-progress',
        value: '#in-progress',
        description: 'Currently being worked on',
        icon: Activity,
        category: 'status',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },
      {
        label: 'review',
        value: '#review',
        description: 'Needs review',
        icon: Eye,
        category: 'status',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },
      {
        label: 'completed',
        value: '#completed',
        description: 'Task completed',
        icon: CheckCircle,
        category: 'status',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },
      {
        label: 'blocked',
        value: '#blocked',
        description: 'Task is blocked',
        icon: XCircle,
        category: 'status',
        execute: (value) => {
          console.log('Adding tag:', value);
        }
      },

      // Type Tags
      {
        label: 'bug',
        value: '#bug',
        description: 'Bug report or issue',
        icon: Bug,
        category: 'type',
        execute: (value) => {
          console.log('Adding bug tag:', value);
        }
      },
      {
        label: 'feature',
        value: '#feature',
        description: 'New feature request',
        icon: Sparkles,
        category: 'type',
        execute: (value) => {
          console.log('Adding feature tag:', value);
        }
      },
      {
        label: 'enhancement',
        value: '#enhancement',
        description: 'Improvement to existing feature',
        icon: TrendingUp,
        category: 'type',
        execute: (value) => {
          console.log('Adding enhancement tag:', value);
        }
      },
      {
        label: 'documentation',
        value: '#docs',
        description: 'Documentation related',
        icon: BookOpen,
        category: 'type',
        execute: (value) => {
          console.log('Adding docs tag:', value);
        }
      },
      {
        label: 'testing',
        value: '#testing',
        description: 'Testing related',
        icon: Target,
        category: 'type',
        execute: (value) => {
          console.log('Adding testing tag:', value);
        }
      },

      // Technology Tags
      {
        label: 'frontend',
        value: '#frontend',
        description: 'Frontend development',
        icon: Monitor,
        category: 'tech',
        execute: (value) => {
          console.log('Adding frontend tag:', value);
        }
      },
      {
        label: 'backend',
        value: '#backend',
        description: 'Backend development',
        icon: Server,
        category: 'tech',
        execute: (value) => {
          console.log('Adding backend tag:', value);
        }
      },
      {
        label: 'api',
        value: '#api',
        description: 'API related',
        icon: Globe,
        category: 'tech',
        execute: (value) => {
          console.log('Adding API tag:', value);
        }
      },
      {
        label: 'database',
        value: '#database',
        description: 'Database related',
        icon: Database,
        category: 'tech',
        execute: (value) => {
          console.log('Adding database tag:', value);
        }
      },
      {
        label: 'security',
        value: '#security',
        description: 'Security related',
        icon: Shield,
        category: 'tech',
        execute: (value) => {
          console.log('Adding security tag:', value);
        }
      },

      // Project Tags
      {
        label: 'research',
        value: '#research',
        description: 'Research task',
        icon: Search,
        category: 'project',
        execute: (value) => {
          console.log('Adding research tag:', value);
        }
      },
      {
        label: 'meeting',
        value: '#meeting',
        description: 'Meeting related',
        icon: Users,
        category: 'project',
        execute: (value) => {
          console.log('Adding meeting tag:', value);
        }
      },
      {
        label: 'deadline',
        value: '#deadline',
        description: 'Has a deadline',
        icon: Clock,
        category: 'project',
        execute: (value) => {
          console.log('Adding deadline tag:', value);
        }
      }
    ]
  },

  ':': {
    ghostText: true,
    placeholder: 'Insert emoji...',
    suggestions: [
      // Emotions
      {
        label: 'happy',
        value: '😊',
        description: 'Happy face',
        icon: Heart,
        category: 'emotions',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      },
      {
        label: 'love',
        value: '❤️',
        description: 'Red heart',
        icon: Heart,
        category: 'emotions',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      },
      {
        label: 'thumbs-up',
        value: '👍',
        description: 'Thumbs up',
        icon: CheckCircle,
        category: 'emotions',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      },

      // Objects
      {
        label: 'fire',
        value: '🔥',
        description: 'Fire emoji',
        icon: Flame,
        category: 'objects',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      },
      {
        label: 'rocket',
        value: '🚀',
        description: 'Rocket emoji',
        icon: Rocket,
        category: 'objects',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      },
      {
        label: 'star',
        value: '⭐',
        description: 'Star emoji',
        icon: Star,
        category: 'objects',
        execute: (value) => {
          console.log('Adding emoji:', value);
        }
      }
    ]
  }
};

export default CommandConfig;