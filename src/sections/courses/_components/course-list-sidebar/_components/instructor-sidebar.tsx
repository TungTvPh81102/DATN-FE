import React from 'react'
import { ICourseFilter, IInstructorResponse } from '@/types'

type Props = {
  instructorData: IInstructorResponse
  dataFilters: ICourseFilter
  setDataFilters: React.Dispatch<React.SetStateAction<ICourseFilter>>
}

export const InstructorSidebar = ({
  dataFilters,
  setDataFilters,
  instructorData,
}: Props) => {
  const handleInstructorChange = (instructorCode: string) => {
    setDataFilters((prev) => {
      const updatedInstructors = prev.instructors?.includes(instructorCode)
        ? prev.instructors.filter((code) => code !== instructorCode)
        : [...(prev.instructors || []), instructorCode]

      const newFilters = { ...prev, instructors: updatedInstructors }

      localStorage.setItem('courseFilters', JSON.stringify(newFilters))

      return newFilters
    })
  }

  return (
    <div className="sidebar-item widget wg-categorie tf-collapse-item">
      <div className="sidebar-title tf-collapse-title">
        <h5 className="fw-5">Người hướng dẫn</h5>
        <i className="tf-collapse-icon icon-arrow-top" />
      </div>
      <ul className="tf-collapse-content">
        {instructorData?.instructors?.map((instructor) => (
          <li key={instructor?.id} className="checkbox-item fl-item3">
            <label>
              <p>{instructor?.name}</p>
              <input
                name="input-level"
                type="checkbox"
                value={instructor?.code}
                checked={
                  dataFilters?.instructors?.includes(instructor?.code) ?? false
                }
                onChange={() => handleInstructorChange(instructor?.code)}
              />
              <span className="btn-checkbox" />
            </label>
            <span>({instructor?.total_approved_courses})</span>
          </li>
        ))}
      </ul>
      {/*<div className="btn-showmore2 showmore views-more-button2">*/}
      {/*  <span className="title">*/}
      {/*    Xem thêm <i className="icon icon-arrow-bottom" />*/}
      {/*  </span>*/}
      {/*</div>*/}
    </div>
  )
}
