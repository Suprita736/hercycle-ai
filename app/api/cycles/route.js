import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { predictNextPeriod } from '@/lib/api-helpers'
import { getAuthUserId } from '@/lib/clerk-server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: cycles, error } = await supabaseAdmin
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .limit(12)

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ success: true, data: { cycles: [], nextPeriodDate: null, confidence: null, averageCycleLength: 28 } })
    }

    const prediction = predictNextPeriod(cycles || [])
    return NextResponse.json({ success: true, data: { cycles: cycles || [], nextPeriodDate: prediction.nextPeriodDate, confidence: prediction.confidence, averageCycleLength: prediction.averageCycleLength } })
  } catch (error) {
    return NextResponse.json({ success: true, data: { cycles: [], nextPeriodDate: null, confidence: null, averageCycleLength: 28 } })
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { start_date, end_date, cycle_length } = body

    const { error } = await supabaseAdmin.from('cycles').insert([{
      user_id: userId,
      start_date,
      end_date,
      cycle_length: cycle_length || 28,
      created_at: new Date().toISOString(),
    }])

    if (error) {
      console.error('Insert cycle error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, end_date } = body

    const { error } = await supabaseAdmin
      .from('cycles')
      .update({ end_date })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
