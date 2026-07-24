export function createInfoPage(){

    const page =
        document.getElementById(
            "info-page"
        );

    page.innerHTML = `

        <h1>
            Info & Controls
        </h1>

        <p>
            Learn how to use the Rubik's Cube Solver.
        </p>

        <div class="info-grid">

            <div class="info-card">

                <h2>Website Overview</h2>

                <p>
                    Welcome to the Rubik's Cube Solver,
                    an interactive 3D web application
                    for simulating and solving Rubik's Cubes.
                </p>

                <p>
                    Features:
                </p>

                <ul>

                    <li>Simulate a 3D Rubik's Cube.</li>

                    <li>Solve any valid cube configuration.</li>

                    <li>Enter cube colors manually.</li>

                    <li>Camera Scan (Coming Soon).</li>

                </ul>

            </div>

            <div class="info-card">

                <h2>Controls</h2>

                <h3>Keyboard</h3>

                <ul>

                    <li><b>U D L R F B</b> → Rotate faces</li>

                    <li><b>Shift + Key</b> → Counter-clockwise</li>

                    <li><b>Alt / Option + Key</b> → 180° Turn</li>

                </ul>

                <h3>Mouse</h3>

                <ul>

                    <li>Drag → Rotate Camera</li>

                    <li>Scroll → Zoom</li>

                </ul>

            </div>

            <div class="info-card">

                <h2>Solver Guide</h2>

                <ol>

                    <li>Scramble the cube.</li>

                    <li>Open the Solver page.</li>

                    <li>Click <b>Start</b>.</li>

                    <li>Use <b>Hint</b> for one move at a time.</li>

                    <li>Or click <b>Solve</b> to solve automatically.</li>

                </ol>

            </div>

            <div class="info-card">

                <h2>Manual Input</h2>

                <ol>

                    <li>Open Manual Input.</li>

                    <li>Select a color.</li>

                    <li>Paint every sticker.</li>

                    <li>Click <b>Check Validity</b>.</li>

                    <li>If valid, click <b>Integrate Cube</b>.</li>

                    <li>Open Solver and solve.</li>

                </ol>

            </div>

            <div class="info-card">

                <h2>Face Colors</h2>

                <ul>

                    <li>⬜ White → Up (U)</li>

                    <li>🟥 Red → Right (R)</li>

                    <li>🟩 Green → Front (F)</li>

                    <li>🟨 Yellow → Down (D)</li>

                    <li>🟧 Orange → Left (L)</li>

                    <li>🟦 Blue → Back (B)</li>

                </ul>

            </div>

            <div class="info-card">

                <h2>Coming Soon</h2>

                <ul>

                    <li>Camera Scan</li>

                    <li>Mobile Friendly Interface</li>

                    <li>Multiple UI Themes</li>

                    <li>Improved Solver Animations</li>

                </ul>

            </div>

        </div>

    `;

}