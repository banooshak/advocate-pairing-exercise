import React from 'react';
import { Advocate } from '../db/index';

interface AdvocateCardProps {
  advocate: Advocate;
  highlightTokens?: string[];
}

function highlightText(text: string, tokens: string[]) {
  if (!tokens || tokens.length === 0) return text;

  // Sort tokens by length descending to prioritize longer matches
  const sortedTokens = [...tokens]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  let result: React.ReactNode[] = [];
  let i = 0;
  const lowerText = text.toLowerCase();

  while (i < text.length) {
    let match = null;
    let matchToken = '';
    for (const token of sortedTokens) {
      if (!token) continue;
      if (lowerText.startsWith(token, i)) {
        match = { start: i, end: i + token.length };
        matchToken = text.slice(i, i + token.length);
        break;
      }
    }
    if (match) {
      result.push(
        <mark
          key={i}
          style={{
            backgroundColor: '#005A9E', // WCAG AA compliant blue
            color: '#fff', // WCAG AA compliant white text
            borderRadius: '0.125rem',
            padding: '0 0.15em',
          }}
        >
          {matchToken}
        </mark>
      );
      i = match.end;
    } else {
      result.push(text[i]);
      i++;
    }
  }
  return result;
}

export function AdvocateCard({
  advocate,
  highlightTokens = [],
}: AdvocateCardProps) {
  const hasSearch = highlightTokens && highlightTokens.length > 0;

  return (
    <li
      className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-2"
      tabIndex={0}
      aria-label={`Advocate ${advocate.firstName} ${advocate.lastName}`}
    >
      <div className="col-span-2 mb-2">
        <strong className="text-lg text-gray-900">
          {hasSearch
            ? highlightText(
                `${advocate.firstName} ${advocate.lastName}`,
                highlightTokens
              )
            : `${advocate.firstName} ${advocate.lastName}`}
        </strong>
      </div>
      <div>
        <span className="block font-semibold text-gray-700" aria-label="City">
          City:
        </span>
        <span className="block text-gray-900">
          {hasSearch
            ? highlightText(String(advocate.city ?? ""), highlightTokens)
            : advocate.city}
        </span>
      </div>
      <div>
        <span className="block font-semibold text-gray-700" aria-label="Degree">
          Degree:
        </span>
        <span className="block text-gray-900">
          {hasSearch
            ? highlightText(String(advocate.degree ?? ""), highlightTokens)
            : advocate.degree}
        </span>
      </div>
      <div>
        <span
          className="block font-semibold text-gray-700"
          aria-label="Years of Experience"
        >
          Experience:
        </span>
        <span className="block text-gray-900">
          {hasSearch
            ? highlightText(String(advocate.yearsOfExperience ?? ""), highlightTokens)
            : advocate.yearsOfExperience}
        </span>
      </div>
      <div>
        <span
          className="block font-semibold text-gray-700"
          aria-label="Phone Number"
        >
          Phone:
        </span>
        <span className="block text-gray-900">
          {hasSearch
            ? highlightText(String(advocate.phoneNumber ?? ""), highlightTokens)
            : advocate.phoneNumber}
        </span>
      </div>
      <div className="col-span-2">
        <span
          className="block font-semibold text-gray-700"
          aria-label="Specialties"
        >
          Specialties:
        </span>
        <ul className="flex flex-wrap gap-2 mt-1">
          {advocate.specialties.map((s, i) => (
            <li
              key={i}
              className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900"
            >
              {hasSearch ? highlightText(String(s ?? ""), highlightTokens) : s}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
