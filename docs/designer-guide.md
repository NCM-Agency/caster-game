# Caster Visual Editor - Designer Guide

## Quick Start

1. **Access the Editor**: https://notcorruptgames.com/editor.html
2. **Make Changes**: Drag, drop, and style components visually
3. **Upload Images**: Drag images directly - they auto-upload to Cloudinary
4. **Save to GitHub**: Click "💾 Save to GitHub" to publish changes

## Editor Interface

### Top Toolbar
- **🗑️ Clear**: Removes all content (asks for confirmation)
- **👁️ View Code**: Shows the HTML/CSS being generated
- **⛶ Fullscreen**: Enter/exit fullscreen mode
- **↶ Undo**: Undo last change
- **↷ Redo**: Redo undone change
- **💾 Save to GitHub**: Saves changes to the live website

### Left Panel - Blocks
Custom Caster components you can drag onto the page:
- **Hero Section**: Full-screen intro with background
- **Caster Card**: Character card with hover effects
- **VIP Benefits**: Benefits list with gradient background
- **Spell Background**: Section with spell card backdrop
- **Golden Button**: Styled CTA button

### Right Panel - Styles
Customize selected elements:
- **Dimension**: Width, height, padding
- **Typography**: Fonts (Cinzel, Crimson Text, Orbitron), size, color
- **Decorations**: Background, borders, shadows
- **Extra**: Opacity, transitions, transforms

## Working with Images

### Uploading New Images
1. Click the image icon in the toolbar
2. Either:
   - Drag & drop image files directly
   - Click "Add Image" and select files
3. Images automatically upload to Cloudinary
4. They're optimized for web (WebP/AVIF format)

### Using Existing Assets
All game assets are pre-loaded:
- 3D box art
- Character cards (7 Casters)
- Spell type cards
- Arena banners
- Playtest photos

### Image Best Practices
- **File Names**: Use descriptive names (hero-background.jpg)
- **Sizes**: Images auto-optimize, but start with reasonable sizes
- **Formats**: Upload PNG for transparency, JPG for photos

## Styling Components

### Brand Colors
- **Gold**: #d4af37 (primary accent)
- **Purple**: #8b4a9c (magical elements)
- **Dark Blue**: #1a1a2e (backgrounds)
- **White**: #ffffff (text on dark)

### Fonts
- **Cinzel**: Fantasy headlines
- **Crimson Text**: Body text
- **Orbitron**: Tech/modern elements

### Adding Custom Styles
1. Select any element
2. Open Style Manager (right panel)
3. Adjust properties
4. Changes apply instantly

## Component Customization

### Hero Section
```
- Change background: Select → Decorations → Background
- Edit text: Double-click to edit inline
- Adjust height: Dimension → Min-height
```

### Caster Cards
```
- Swap image: Select card → Click image → Replace
- Edit lore: Double-click text areas
- Adjust size: Dimension → Width/Height
```

### CTA Buttons
```
- Change color: Decorations → Background
- Edit text: Double-click button
- Add hover: Extra → Transition
```

## Publishing Changes

### Save to GitHub (Recommended)
1. Make your changes
2. Click "💾 Save to GitHub"
3. Wait for success message
4. Changes go live in ~30 seconds

### What Gets Saved
- All HTML structure changes
- Inline styles you've added
- Component arrangements
- Text edits

### What Doesn't Change
- Core site functionality (forms, animations)
- External CSS (styles.css)
- JavaScript behaviors (script.js)

## Tips & Tricks

### Responsive Design
- Test at different screen sizes using browser tools
- Stack elements vertically for mobile
- Use percentage widths instead of fixed pixels

### Performance
- Images auto-optimize through Cloudinary
- Don't worry about file sizes - system handles it
- Reuse components rather than duplicating

### Common Tasks

**Change Hero Image**
1. Select hero section
2. Style Manager → Decorations → Background
3. Enter: url('your-image.jpg')

**Add New Section**
1. Drag a block from left panel
2. Drop between existing sections
3. Customize content and style

**Reorder Sections**
1. Select section (blue outline appears)
2. Drag by the move handle (⋮⋮)
3. Drop in new position

**Delete Section**
1. Select section
2. Press Delete key
3. Or right-click → Delete

## Troubleshooting

### "Save to GitHub Failed"
- Refresh page and try again
- Check with developer if token expired
- Your changes are saved locally as backup

### Images Not Uploading
- Check file size (<10MB recommended)
- Try different format (JPG instead of PNG)
- Refresh page and retry

### Can't Select Element
- Click the layers icon (bottom left)
- Find element in layer tree
- Click to select directly

### Changes Not Showing
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache
- Check if saved successfully

## Best Practices

1. **Save Frequently**: Click Save to GitHub after major changes
2. **Test on Mobile**: Always preview mobile view
3. **Keep It Simple**: Don't over-customize
4. **Use Brand Assets**: Stick to provided colors/fonts
5. **Backup Big Changes**: Screenshot before major edits

## Keyboard Shortcuts

- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo  
- **Delete**: Remove selected element
- **Ctrl+C/V**: Copy/paste elements
- **Escape**: Deselect element

## Need Help?

- **Technical Issues**: Contact the developer
- **Design Questions**: Refer to brand guidelines
- **Feature Requests**: Document what you need

## Advanced Features

### Custom Code Components
For special needs, you can add custom HTML:
1. Drag "Custom Code" block
2. Edit HTML directly
3. Add inline styles

### Media Queries
For precise responsive control:
1. View Code to see CSS
2. Add media queries in Custom Code block
3. Target specific screen sizes

Remember: The editor is powerful but keep the user experience simple and fast!