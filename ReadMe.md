# Shooting Flappy Bird

[Link to Live Deployment](https://shooting-flappy-bird.vercel.app/)

This is a improvised version of popular "Flappy Bird" game.

Player navigates the bird thru multiple obstacles and at the same keep it afloat. The user will have options to launch straight missile to destroy obstacles

## 🌼 User Story / Journey

- Player starts the game using "Start Button"
- Bird starts to move down with constant acceleration if there is no user action
- Player keeps the bird afloat using Up arrow key or Up button
- Rocks start coming towards the bird and the player needs to dodge them
- Player can destroy some rocks using missile once every 5s
- Player's overall score is decided beased on total distance travelled without crashing the bird on a rock or at the boundaries
  <br></br>

## 🎨 Wireframe / User Interface

Key Buttons available for the player:

1. StartButton - To start game
2. Up Button - To keep bird afloat
3. Missile Button - To launch missile to destroy rock

The game container screen remains constant and holds the following:

1. Flappy Bird
2. Moving Rocks
3. Missile
4. Moving Rock Floor

![User Interface](/Report/SFB_User%20Interface.jpg)
![User Interface](/Report/UserInterface.gif)
<br></br>

## 💻 Key Variables of Program

"Game" object stores key variables that defines the game state:

1. Bird: --> Position, Alive_status.
2. Rock: --> Position, Speed, GenerationRate
3. Ground Rock --> Starting Position
4. Total Score & Time Passed
   <br></br>

## 💻 Program Architecture

The program has 4 main types of functions that makes the game work:

1. Render --> This function reads the "game" object and places the rocks, bird and missile in the right location
2. Time-Step --> This function runs every 0.1 and manipulates the "game" variable to move the positions
3. Initialize --> Resets "game" object at the begining and after reset by user actions
4. Event Listener Functions --> Manipulates "game" object as per user inputs

![Program Architecture](/Report/SFB_Program_Architecture.jpg)

## 🌼 Key Learnings

This was part of my first project in my GA Software Engineering Course. Learnt a lot of interesting concepts / tools in the process. Some of the key take-aways/moments for me as a programmer include following:

- Being able to think from a "MVC" (Model-View-Controller) perspective to design a software product. Found this MVC struture to be quite elegant and helped me shape how to define global variables that define game state (Model), the function that renders the HTML output (View) and functions that manipulate the game state varables (controller). The above diagram also illustrates this MV structure
- Tried to understand concepts of "Clean Code" and tried to apply the same. Incorporate discipline in varaible nomenclature and defined functions at all possible appropriate places to avoid repeating
- Got some exposure to things that can make application slower and worked to make the application more efficient. For Eg: Instead of constantly loading different images to create animation, learnt that it was more efficient to load all relevant images at start and use CSS animations to create the animation effect.
- In addition to JS, also got good exposure to power of CSS. Learnt real meaning and impact of various CSS properties like "position, "dispay", "flex-box related properties","CSS-animations & keyframe"
