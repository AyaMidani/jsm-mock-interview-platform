import { Button } from "@/components/ui/button";
import Link from 'next/link';
import React from 'react';
import Image from 'next/image'
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import { GetFeedbackByInterviewId, getInterviewByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";



export default async function Page() {
  const user = await getCurrentUser();
  const userInterviews = await getInterviewByUserId(user?.id || '');

  const interviewsWithFeedback = await Promise.all(
    userInterviews?.map(async (interview) => {
      const feedback = await GetFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id || '',
      });
      return { ...interview, hasFeedback: !!feedback };
    }) ?? []
  );

  const completedInterviews = interviewsWithFeedback.filter(i => i.hasFeedback);
  const upcomingInterviews = interviewsWithFeedback.filter(i => !i.hasFeedback);

  const hasPastInterviews = completedInterviews.length > 0;
  const hasUpcomingInterviews = upcomingInterviews.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className='text-lg'>Practice on real Interview Questions & get instant feedback.</p>
          <Button className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="Robot" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            completedInterviews.map((interview) => (
              <InterviewCard {...interview} userId={user?.id} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t completed any interviews yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            upcomingInterviews.map((interview) => (
              <InterviewCard {...interview} userId={user?.id} key={interview.id} />
            ))
          ) : (
            <p>No interviews available to take.</p>
          )}
        </div>
      </section>
    </>
  );
}