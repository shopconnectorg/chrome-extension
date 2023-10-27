import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const hideString = (input, first = 15, second = -10) => {
	return `${input.slice(0, first)}…${input.slice(second)}`;
};

export const getCategoryName = (category) => {
  switch (category) {
    case 'budget_coffee':
      return 'Budget coffee'
    case 'budget_coffee_machines':
      return 'Budget coffee machines'
    case 'coffee_brewing_supplies':
      return 'Coffee brewing supplies'
    case 'premium_coffee':
      return 'Premium coffee'
    case 'premium_coffee_machines':
      return 'Premium coffee machines'
  }
}
