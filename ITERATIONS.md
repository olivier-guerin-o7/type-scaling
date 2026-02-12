# Feedback for the ds-type-scale project
## 2026-02-12 11:10
Feature scope update, UI Polish
### Features
- Rememove the "compare" feature and forget about it. This app doesn't need it.
### Header
- Remove the compare Button
- Dark mode Button: update the Label to "Switch to Dark mode"
### Left panel
- Scrolling:
    - Fixed and always visible:
        - The Font type tabs and the Combobox, including its helper text
        - The Bottom button "Open in Google font"
    - Can scroll: the Preview region
- Combobox:
    - Make the text field more visible: higher contrasted border
        - Contrast has been incrased but I'd like the text input to be even more visible -> Incrase the border to 2px
    - Make the reset icon button in the text field only appears when the user has typed some text
        - The reset icon button is still always visible and should only appears when some input istyped by the user
    - Change its Label above the text input to "Search and select a font"
    - Add a help button right after this label (icon button with a question mark):
        - It triggers a Modal in which is explained what are Google fonts, that a subset of 100 from the 1500 fonts has been chosen to fit with Interface design for Saas projects.
            - The modal works but I'd like to add a "Got it, close this message" primary button at the bottom of this modal. Also, make sure that the Modal can be closed as well by pressing [ESC]
- Preview:
    - The default font selected should have its name displayed above its preview (currently this name appears only when another font is selected)
        - When I open the page, the default font name is still not displayed. It only appears when changing font. Please fix that
    - "Aa" should be the default preview (it has currently been removed from the pool of preview and replaced by "Gg")
    - Arrow buttons on each sides should be slightly more visible: increase their size a bit.
    - "How it works" should be removed since these info have been moved to the Combobox Label, Helper text and help button
    - Add: after the Numbers, add a section "Details" with: the font supported languages, its amount of weights, its author and/or type foundry, its date of creation. Adjust these details to what can be found using the Google font API.
        - This doesn't appear to work: I don't see any details after the numbers preview section
- Right panel:
    - Scrolling:
        - Same behaviour as the left panel:
            - Fixed and always visible:
                - Tabs always remain visible at the top
                - Bottom button anchored to the bottom
                    - Buttons are not anchored to the bottom while they always should whatever is the code content
    - Actions:
        - Move the "copy" button to the bottom fixed area and make it a primary button
        - Change the "close" button (currently an icon button with a "X") to a collapse/expand icon button to let the user hide/show the right panel
            - It works but the icon is misleading (too generic): use another icon better suited for an horizontal expand/collapse
        - Fixed bottom action area, from left to right:
            - Copy is the primary button
            - "Download X" - where X is the currently selected format - is the secondary button
            - The two buttons should have an horizontal behaviour "Hug content" instead of "fill the container". They should just adjust to their content, leaving some space on their right if needed
## 2026-02-12 12:15
UI Polish
## Styling
- Change theprimary colour (used for example for primary buttons and active tabs) from Blue to a colour between red and orange (closer to red)
### Left panel
- Add a bit of vertical space between the tabs and the combobox Label to detach them
- Add a bit of vertical space between the helper text and the Font name & preview
- Add a light horizontal divider to separate the fixed header from the preview (same style as the bottom one between the preview and the bottom button)
- Combobox:
    - New: as it's both a text input AND a Select, add an icon only button (top and down chevrons depending on the combobox dropdown state) on the right side, inside the Combobox to tell users that they can either type some name font and/or click this button to open the dropdown menu
- Preview:
    - Add: after the Numbers, add a section "Details" with: the font supported languages, its amount of weights, its author and/or type foundry, its date of creation. Adjust these details to what can be found using the Google font API.
        - This STILL doesn't appear to work: I don't see any details after the numbers preview section
## Right panel:
    - Expand/Collapse
        - When collapsed, there's no way to reopen the right panel in the large breakpoint.

# 2026-02-12 13:15
## Header
## Left panel
- the horizontal divider should not be below the font name, but above
- Details should be stacked vertically: Label then value for each type (Designer, year etc..)
- Details: reorder them : Weights > languages > Designer > Year
- Optical sizing, x-height etc.. should be moved to the central panel at the top of the page as contrasted tags (black background), left aligned and horizontally displayed. 
## Right panel
- When the right panel is collapsed, the button to expand it should be more visible -> Use a primary style but keep the icon only button

# 2026-02-12 13:48
## Header
- Test a red background version (use the same colour as the primary one)
    - With all its content in White
## Left panel
-  Reduce the space above the divider which is situated above the font name
- Remove the Label "details" as the following Labels are explicit enough
- Use CAPS for each Labels of the preview
## Center panel
- Font capabilities and specifics (x-height, optical size) should be more explicit:
    - Add a ":" between x-height and the percentage
    - Same for Optical size: and value is "yes" or "no" -> Always visible
- Font capabilities tagsshould have rounded corners
- HTML tags (H1, H2 etc..) and Text-size and line-height should become darker when the user hover the line
- Text-size and line-height -> As Tags like the ones used for x-height and optical size
- Add a light horizontal divider between each size so that the user can visually connect each entry with the text-size/lineheight value without effort
- 
## Right panel
- Copy button: remove the floating popup as the button itself show action success

# 2026-02-12 14:10
## Header
- Change to a black background and don't forget to also change the right buttons to white icon & text
## Left Panel
- Remove as well the Label "Preview" 
- Put all Preview Labels in CAPs -> Weights, languages, Designer and year
## Center panel
- Optical sizing and x-height container should have rounded corners
- Text size and line-height background -> To white (both in rest state and row hover state)
- Add a legend at the top for each column
- Create a top right button to let the user change the sample text -> Modal with text input and "update the sample text" button (primary)
## Mobile view
- Bottom menu should be more visible -> Black and bold

# 2026-02-12 14:23
## Header
- Copy URL and switch to dark mode buttons are still in a dimmed grey: ensure they are white
## Left Panel
- Change the "Open in Google font button" so that it's an icon only button horizontally aligned with the font name, and anchored on the right side of panel. Make it red (no background. A ghost button). Add a tooltip on hover with the full label "Open in Google fonts". When clicked, open a modal to tell the user that it will open a new page to see the font in google (phrase it correctly). With a confirmation button at the bottom like the other modals. Add a secondary button "Open google and don't ask me again" (phrase it better as well)
- This means that there should not be any fixed area at the bottom and the Preview scroll takes that into account
## Center panel
- Optical sizing and x-height container should have rounded corners: I don't know why you fail to do that. Explain meif needed
- Move the top right "edit sample text" button to next to the Sample column header as an icon only button. Icon only with a tooltip. The pen icon only: not the one with the frame. In red colour (ghost button)
- Add at the top right of the center panl - to replace the moved "edit sample text" button - a "Edit scale" button. A custom button with white background but a dark border (1px) with a shadow. For now: no action assigned to it

# 2026-02-12 14:45
## Header
- The two button on the right rest states are still dimmed: icons and texts should be white. With for the hover state a dark grey background appearing that wil l"highlight" these ghost buttons
## Left Panel
- move the "open in google" icon only button after the font name instead of anchored on the right
- Replace the Languages, Designer and Year section by a single one named "Variants" as label and as description a single sentece like "9 weights - 5 languages" (users who want to know more about the designer and the year wil lvisit the google font site) -> It should - as a result - limit the amount of case in which there's a scroll for the preview par of the left panel
## Center panel
- HTML column labels should be the same colour as the sample text. 
- Edit scale button shadow -> Increase its spread but not it's strenght
- Edit sample text button: change to dark icon with a white background (ounded corners)

# 2026-02-12 14:49
## Left Panel
- Ensure that font listed in the Combobox are ordered alphabetically
- The open in google font icon only button should be slightly closer to the font name
- The font name should use the font selected
- Remove the helper text "select a font..." below the combobox
- Add a smooth and very short animation to transition from a preview to another (e.g. from Aa to Gg). It should emphasis the navigation (left or right) in a subtle way
## Center panel
- Add a single help button right after the optical and x-height pills and explain - in the modal that it opens - the reasoning and the math behind the type scaling. With a closing button like the other modals and with the label "Got it, close "
- For the edit scale button. action = it refreshes the center panel by removing its content and display a vertically and horizontally centered message "coming soon". Create an empty page visual if you feel so. Discrete. And adda just below a primary button "back to my type scale" which - when clicked - revert back to the type scale.

# 2026-02-12 15:19
## Left Panel
- Aa animation -> Keep the velocity but make it snappier: more quick at start with a deceleration at the end (use bezier curve)
- Now that we have more space, increase the size of the preview (Aa and all of them) by approximately 25% rounded to a vertical line height being a multiple of 8
- Alphabet / Numbers / Variants ->Ensure these blocks are evenly vertically spaced. Slightly increase this vertical space
## Center panel
- The empty state for the Edit scale button should also be vertically centered in the page
- I noticed that it's possible for the user to directly edit the sample text by just editing it. That's great. Now make it update all rows instead of just the current one. Without refresh of the page or font selected. As soon as the user hit enter OR click somewhere else in the page (or press ESC). 
- As a result, remove the edit sample button next to the column header "Sample"
- Help button next to optical and x-height -> Make it primary, same vertical size as the pills.

# 2026-02-12 15:37
## Left Panel
- Glyph animation is now a bit too quick, find a sweet spot between the previous version and the last one. Avoid the flickering effect triggered by opacity -> Less opacity change during the animation.
- Glyph increase is good: keep it. But revert back the other preview elements to their previous size (the sentence, the alphabet, the numbers and the variants)
- Re- add the name of the author and the year in small anchored at the bottom on the left panel: Name on the left side and Date on the right side. 
## Center panel
- Help button after optical and x-height: too visible now. Transform it into a link with the label "learn more about the methodology"
- Each pill "Optical" and " x-height" should be clickable to open a Modal and explain their definition
## Right panel
- When collapsed, the expand button is now over the content of the page: ensure that the content of the page doesn't go below it

# 2026-02-12 15:37
## Left Panel
- Author and date -> Slightly more detached from the bottom. No divider above them. Darker Text colour
## Center panel
- The link  "learn more" should be darker and its text should have the same size as the text of the pills on its left. And its text should be vertically aligned with the text from the pills. Also sperate it from the pills a bit.
## Right panel
- Align vertically the Tabs (+ the expand collapse button) with the "edit scale button from the center panel (so that when collapsed, the button to extend is visually aligned with it as well ). This is not for UX but more UI. Don't overdo it. This should as well give a little bit more vertical breath to the right panel header 

# 2026-02-12 15:58
## Left Panel
- Author and date -> Even a bit more detached from the bottom. Make their size the same as the text used to display the weight and the languages ( the value, not the label above)
- Glyph animation: it seems to "stop" a bit midway -> revert back to the first version of the animation
## Center panel
- The link  "learn more" -> change the label to "learn more"
## Right panel
- Alignment of the tabs with the "edit scale" button -> A bit more down. Take as areference the expand/collapse button which should be perfectly vertically aligned with "Edit scale" text. Adjust the tabs vertical position accordingly to make them aligned as well with the expand collapse button ( a they do currently)

# 2026-02-12 16:07
## Center panel
- there's a light grey container around the pills and the learn more -> Inside it slightly increase the horizontal padding
## Right panel
- Alignment of the tabs with the "edit scale" button -> Almost there! tabs and collapse buttons are still a couple pixels too high. See if you can fix it. otherwise it's ok.

# 2026-02-12 16:20 (direct instructions)
## Right panel
- Ensure the expand button is aligned (26px) when the right panel is collapsed
- Reduce code-output header top padding from 27px to 26px
- Add a very light, quick and smooth animation for expand/collapse right panel (grid column transition + opacity fade, 150ms)
## Combobox
- Truncate long font names in the dropdown to prevent horizontal scrolling
- Detach the dropdown slightly from the input so the focus ring doesn't conflict (4px -> 6px)
## Font selector
- When choosing a different font type (e.g. Serif), auto-select a default font matching that type if the current one doesn't match (Inter for All/Sans-serif, first alphabetical for Serif)
## Header
- Slightly increase the vertical padding (--space-3 -> --space-4), updated all 57px header height references
## Center panel
- Edit scale button: fix hover state — only darken border on hover, no background/shadow change
- Remove hover state from Optical sizing and x-height pills

# 2026-02-12 16:30
## Header
- Revert header to white background with black text (use theme tokens for dark mode support)
- Subtitle uses muted secondary colour instead of white at 75% opacity
- Header buttons revert to standard tertiary style (dark text, subtle hover)
- Add subtle bottom border to separate header from content
## Copy URL feedback
- Replace floating toast with inline "Link copied!" text appearing to the left of the Copy URL button
- Green text, fades in/out over 2 seconds
