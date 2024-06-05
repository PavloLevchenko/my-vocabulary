enum Direction {
	Up = "ArrowUp",
	Down = "ArrowDown",
	Left = "ArrowLeft",
	Right = "ArrowRight",
	W = "KeyW",
	S = "KeyS",
	A = "KeyA",
	D = "KeyD",
}

export const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
	const values: string[] = Object.values(Direction);

	if (values.includes(event.code)) {
		event.preventDefault();
		event.stopPropagation();
	}
	console.log(event.code);
	switch (event.code) {
		case Direction.Left || Direction.A:
			return -1;
		case Direction.Right || Direction.D:
			return 1;
		default:
			return 0;
	}
};
