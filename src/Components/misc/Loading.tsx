import LoopIcon from "@mui/icons-material/Loop";

interface LoadingProps {
	message: string;
}

export default function Loading(props: LoadingProps) {
	const { message } = props;

	return (
		<div className='w-full h-full fixed top-0 left-0 bg-background bg-opacity-70 flex justify-center items-center'>
			<div className='w-[240px] h-[180px] bg-white p-4 rounded-xl flex flex-col items-center justify-evenly'>
				<h2 className='text-black font-medium mb-3'>{message}</h2>
				<h2 className='text-black font-medium mb-3'>
					<LoopIcon
						fontSize='large'
						sx={{
							animation: "spin 2s linear infinite",
							"@keyframes spin": {
								"0%": {
									transform: "rotate(360deg)",
								},
								"100%": {
									transform: "rotate(0deg)",
								},
							},
						}}
					/>
				</h2>
			</div>
		</div>
	);
}
