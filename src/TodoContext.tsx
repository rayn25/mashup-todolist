import React, {
    createContext,
    useReducer,
    useContext,
    useRef,
    Dispatch,
    MutableRefObject,
} from 'react';

const initialTodos = [
    {
        id: 1,
        text: '프로젝트 생성하기',
        done: true,
    },
    {
        id: 2,
        text: '컴포넌트 스타일링하기',
        done: true,
    },
    {
        id: 3,
        text: 'Context 만들기',
        done: false,
    },
    {
        id: 4,
        text: '기능 구현하기',
        done: false,
    },
];

type State = {
    id: number;
    text: string;
    done: boolean;
};

type Action =
    | { type: 'CREATE'; todo: State }
    | { type: 'TOGGLE'; id: number }
    | { type: 'REMOVE'; id: number };

const todoReducer = (state: State[], action: Action): State[] => {
    switch (action.type) {
        case 'CREATE':
            return state.concat(action.todo);
        case 'TOGGLE':
            return state.map((todo) =>
                todo.id === action.id ? { ...todo, done: !todo.done } : todo,
            );
        case 'REMOVE':
            return state.filter((todo) => todo.id !== action.id);
        default:
            throw new Error(`Unhandled action type`);
    }
};

type SampleDispatch = Dispatch<Action>;
type SampleRef = MutableRefObject<number>;

const TodoStateContext = createContext<State[] | null>(null);
const TodoDispatchContext = createContext<SampleDispatch | null>(null);
const TodoNextIdContext = createContext<SampleRef | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(todoReducer, initialTodos);
    const nextId = useRef(5);

    return (
        <TodoStateContext.Provider value={state}>
            <TodoDispatchContext.Provider value={dispatch}>
                <TodoNextIdContext.Provider value={nextId}>{children}</TodoNextIdContext.Provider>
            </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>
    );
}

export function useTodoState() {
    const state = useContext(TodoStateContext);
    if (!state) throw new Error('Cannot find TodoProvider');
    return state;
}

export function useTodoDispatch() {
    const dispatch = useContext(TodoDispatchContext);
    if (!dispatch) throw new Error('Cannot find TodoProvider');
    return dispatch;
}

export function useTodoNextId() {
    const nextId = useContext(TodoNextIdContext);
    if (!nextId) throw new Error('Cannot find TodoProvider');
    return nextId;
}
