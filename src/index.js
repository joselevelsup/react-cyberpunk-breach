import React, { useState, useEffect } from "react";
// import "./index.css";

const listOfBuffers = ["C7", "2B", "3J", "1C", "BD", "7A", "55", "OP"];

const randomizedBuffers = (size) => {
	const areaOfbuffers = [];

	for(let i = 0; i < size; i++){
		areaOfbuffers.push([]);
		for(let j = 0; j < size; j++){
			areaOfbuffers[i].push(listOfBuffers[Math.floor(Math.random() * listOfBuffers.length) + 0]);
		}
	}

	return areaOfbuffers;
}

const randomCodeToCrack = (size) => {
	return listOfBuffers.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value).slice(0, size);
}

export default function QuickHackBreach({ bufferWidthAndHeight = 5, amountToCrack = 3, solvedFunction }){
	const randomizedGraphOfBuffers = randomizedBuffers(bufferWidthAndHeight);
	const startingRowOrCol = Math.floor(Math.random() * 1) + 0;
	const startingPos = Math.floor(Math.random() * bufferWidthAndHeight) + 0;
	const codeToCrack = randomCodeToCrack(amountToCrack); 

	const [ randomBuffers, setRandomBuffers ] = useState([]);
	const [ codes, setCodeToCrack ] = useState([]);
	const [ selectedBuffers, addSelectedBuffer ] = useState([]);
	const [ xOrY, changeXOrY ] = useState({
		posGraph: startingRowOrCol > 1 ? "x" : "y",
		pos: {
			x: startingPos,
			y: startingPos
		} 
	});

	const [ currentLives, setActiveLives ] = useState(amountToCrack);
	const [ hacked, setHackstate ] = useState(false);

	useEffect(() => {
		setRandomBuffers(randomizedGraphOfBuffers);
		setCodeToCrack(codeToCrack);
	}, []);

	useEffect(() => {
		const intersection = codes.filter(c => selectedBuffers.includes(c));
		if((intersection.length !== 0 && codes.length !== 0) && intersection.length == codes.length){
			setHackstate(true);
      solvedFunction(true);
		}
	}, [selectedBuffers])

	const selectBuffer = (buffer, x, y) => {
		const foundBuffer = codes.findIndex(b => b == buffer);

		if(foundBuffer == -1){
			let l = currentLives - 1;
			setActiveLives(l);
		}

		addSelectedBuffer([...selectedBuffers, buffer]);
		changeXOrY({
			posGraph: xOrY.posGraph == "x" ? "y" : "x",
			pos: {
				x,
				y
			}
		});
	}

	return (
    <>
      <style jsx>
        {`
					.quickhack{
						display: flex;
					}

					.main {
						background-color: lightgray;
					}

					.row{
						display: flex;
					}

					.col{
						flex-direction: column;
						padding: 5px;
					}

					.row.highlighted, .col.highlighted {
						background-color: white;
					}

					.col div, .code {
						padding: 10px;
						width: 30px;
						height: 30px;
						background-color: transparent;
						border: 2px solid transparent;
						text-align: center;
					}

					.code {
						margin-bottom: 2px;
					}

					.code.solved{
						border-color: black;
					}

					p {
						padding-left: 40px;
					}

					.col.highlighted div:hover, .row.highlighted div:hover  {
						border-color: black;
						cursor: pointer;
					}
			`}
      </style>
			<div className="quickhack">
				<div className="main">
					{
						randomBuffers.map((bufferRow, i) => (
							<div key={i} className={`row ${(xOrY.posGraph == "x" && xOrY.pos.x == i) ? "highlighted" : ""}`}>
								{
									bufferRow.map(( buffer, j ) => (
										<div key={`${buffer}-${i}-${j}`} className={`col ${( xOrY.posGraph == "y" &&  xOrY.pos.y == j ) ? "highlighted" : ""}`}>
											<div onClick={((xOrY.posGraph == "y" && xOrY.pos.y == j) || (xOrY.posGraph == "x" && xOrY.pos.x == i)) ? () => selectBuffer(buffer, i, j) : () => null}>
												{buffer}
											</div>
										</div>
									))
								}
							</div>
						))
					}
				</div>
				<div className="to-solve">
					{
						currentLives > 0 ?
							<>
								{
									hacked ?
										<p>DataMine Successfully Uploaded</p>
										:
										<p>Lives: {currentLives}</p>
								}
							</>
						:
						<p>DataMine: Failed</p>
					}
					<ul style={{ listStyleType: "none" }}>
						{
							codes.map(buffer => (
								<li className={`code ${selectedBuffers.findIndex(b => buffer == b) !== -1 ? "solved": "unsolved"}`} key={buffer}>{buffer}</li>
							))
						}
					</ul>
				</div>
			</div>
    </>
	)
}
