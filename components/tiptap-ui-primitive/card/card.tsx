"use client"

import { cn } from "@/lib/tiptap-utils"
import "@/components/tiptap-ui-primitive/card/card.scss"

const Card = ({ className='', ...props }) => {
    return <div className={cn("tiptap-card", className)} {...props} />
  }
Card.displayName = "Card"

const CardHeader = ({ className='', ...props }) => {
    return (
      <div
        className={cn("tiptap-card-header", className)}
        {...props}
      />
    )
  }
CardHeader.displayName = "CardHeader"

const CardBody = ({ className='', ...props }) => {
    return (
      <div className={cn("tiptap-card-body", className)} {...props} />
    )
  }
CardBody.displayName = "CardBody"

const CardItemGroup = ({ className='', orientation = "vertical", ...props }) => {
  return (
    <div
      data-orientation={orientation}
      className={cn("tiptap-card-item-group", className)}
      {...props}
    />
  )
}
CardItemGroup.displayName = "CardItemGroup"

const CardGroupLabel =
  ({ className='', ...props }) => {
    return (
      <div
        className={cn("tiptap-card-group-label", className)}
        {...props}
      />
    )
  }
CardGroupLabel.displayName = "CardGroupLabel"

const CardFooter = ({ className='', ...props }) => {
    return (
      <div
        className={cn("tiptap-card-footer", className)}
        {...props}
      />
    )
  }
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardBody, CardItemGroup, CardGroupLabel }
