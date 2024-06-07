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

const prevent = (event: any, values: string[]) => {
	if (values.includes(event.code)) {
		event.preventDefault();
		event.stopPropagation();
	}
};

export const handleSchift = (event: React.KeyboardEvent<HTMLElement>) => {
	prevent(event, Object.values(Direction));

	switch (event.code) {
		case Direction.Left || Direction.A:
			return -1;
		case Direction.Right || Direction.D:
			return 1;
		default:
			return 0;
	}
};

export const handleConfirm = (event: React.KeyboardEvent<HTMLElement>) => {
	prevent(event, Object.values(Direction));

	switch (event.code) {
		case Direction.Up:
			return true;
		case Direction.Down:
			return false;
		default:
			return;
	}
};
