import {compareCourses, Course} from "../model/course";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {createReducer, on} from "@ngrx/store";
import {CourseActions} from "../action-types";

export interface CoursesState extends EntityState<Course>{
  allCoursesLoaded: boolean
}

export const adapter = createEntityAdapter<Course>({
  sortComparer: compareCourses,
});

export const initialCoursesState = adapter.getInitialState({
  allCoursesLoaded: false
});

export const coursesReducer = createReducer(
  initialCoursesState,
  on(CourseActions.allCoursesLoaded, (state, action) => adapter.setAll(action.courses, {...state, allCoursesLoaded: true}))
)

export const { selectAll } = adapter.getSelectors();
