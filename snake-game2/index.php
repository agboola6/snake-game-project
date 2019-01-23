<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<?php
$page = 'snake-game';
$subTitle = '';
$currentDate =  date('ljSFYhisA');
$content = '
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.sound.min.js"></script>
    <link rel="stylesheet" type="text/css" href="canvas.css?t=' . $currentDate . '">
</head>
<body>
    <main class="main-content">
    <div class="block entry-content text-center">
        <h1>Snake Game</h1>
        <div style="width: 100%; overflow: hidden;">
            <table>
            <col width="30%">
            <col width="70%">
            <tr>
            <td>
                <fieldset>
                    <legend>Rules:</legend>
                    Use Arrow Keys to move.<br>
                    Use Space Bar to pause.<br>
                    The snake starts small and eats the apple (red) to grow larger.<br>
                    The objective is to eat as many apples as possible while avoiding the 4 walls and the snake itself.
                </fieldset>
            </td>
            <td>
                <div id="playCanvas"></div>
                <button id="btnGiveCommand">Restart!</button>
            </td>
            </tr>
            </table>
        </div>
    </div>
    </main>
</body>
<script src="sketch.js?t=' . $currentDate . '"></script>
';
include('../../master.php');
?>
