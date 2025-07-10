"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useLanguage } from "@/contexts/language-context"

export default function SurveyPage() {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const [profileData, setProfileData] = useState({
    isFirstPregnancy: "",
    livingChildrenCount: "",
    deliveryType: "",
    birthPlace: "",
  })

  const [surveyData, setSurveyData] = useState({
    toldAboutCynto: "",
    gaveConsent: "",
    knewWhyCynto: "",
    strongContractions: "",
    morePainThanExpected: "",
    askedToStop: "",
    problemsAfterDelivery: "",
    feltRespected: "",
    tooMuchCyntoUsed: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    } else if (profile?.form_completed) {
      router.push("/posts")
    }
  }, [user, profile, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      toast({
        title: "Error",
        description: "Database not configured. Please add your Supabase credentials.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      console.log("Submitting survey data...")

      // Update profile with pregnancy information
      const profileUpdateData = {
        is_first_pregnancy: profileData.isFirstPregnancy === "yes",
        living_children_count: Number.parseInt(profileData.livingChildrenCount) || 0,
        delivery_type: profileData.deliveryType as any,
        birth_place: profileData.birthPlace as any,
        form_completed: true,
      }

      console.log("Profile update data:", profileUpdateData)

      const { error: profileError } = await updateProfile(profileUpdateData)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      // Save survey data
      const surveyInsertData = {
        user_id: user!.id,
        told_about_cynto: surveyData.toldAboutCynto === "yes",
        gave_consent: surveyData.gaveConsent === "yes",
        knew_why_cynto: surveyData.knewWhyCynto === "yes",
        strong_contractions: surveyData.strongContractions === "yes",
        more_pain_than_expected: surveyData.morePainThanExpected === "yes",
        asked_to_stop: surveyData.askedToStop === "yes",
        problems_after_delivery: surveyData.problemsAfterDelivery === "yes",
        felt_respected: surveyData.feltRespected === "yes",
        too_much_cynto_used: surveyData.tooMuchCyntoUsed === "yes",
      }

      console.log("Survey insert data:", surveyInsertData)

      const { data: surveyResult, error: surveyError } = await supabase
        .from("medical_surveys")
        .insert(surveyInsertData)
        .select()

      console.log("Survey insert result:", { surveyResult, surveyError })

      if (surveyError) {
        console.error("Survey insert error:", surveyError)
        throw surveyError
      }

      toast({
        title: "Success",
        description: "Survey completed successfully!",
      })

      router.push("/posts")
    } catch (error: any) {
      console.error("Survey submission error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save survey data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !profile) return;
    if (profile.gender === "female" && !profile.form_completed) {
      router.push("/survey");
    }
  }, [user, profile, router]);

  if (!user || !profile) return null;
  if (profile.gender !== "female") return null; // Optionally show a message

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Medical Survey</CardTitle>
            <CardDescription>Please complete this survey about your pregnancy and delivery experience</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {/* Profile completion */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Pregnancy Information</h3>

                <div className="space-y-3">
                  <Label>Is this your first pregnancy? / هل هذه ولادتك الأولى؟</Label>
                  <RadioGroup
                    value={profileData.isFirstPregnancy}
                    onValueChange={(value) => setProfileData((prev) => ({ ...prev, isFirstPregnancy: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="first-yes" />
                      <Label htmlFor="first-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="first-no" />
                      <Label htmlFor="first-no">No / لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="children-count">Number of living children / عدد الأطفال الأحياء</Label>
                  <Input
                    id="children-count"
                    type="number"
                    min="0"
                    value={profileData.livingChildrenCount}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, livingChildrenCount: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Delivery type / نوع الولادة</Label>
                  <Select onValueChange={(value) => setProfileData((prev) => ({ ...prev, deliveryType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural / طبيعية</SelectItem>
                      <SelectItem value="cesarean">Cesarean / قيصرية</SelectItem>
                      <SelectItem value="both">Both / كلاهما</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Where did you give birth? / مكان الولادة</Label>
                  <Select onValueChange={(value) => setProfileData((prev) => ({ ...prev, birthPlace: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select birth place" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public_hospital">Public Hospital / مستشفى عام</SelectItem>
                      <SelectItem value="private_hospital">Private Hospital / مستشفى خاص</SelectItem>
                      <SelectItem value="clinic">Clinic / عيادة</SelectItem>
                      <SelectItem value="other">Other / آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Before injection */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Before Cytotec injection / قبل حقن السيتوتاك</h3>

                <div className="space-y-3">
                  <Label>Were you told that you would be given Cytotec? / هل قيل لك أنه سيتم إعطاؤك السيتوسين؟</Label>
                  <RadioGroup
                    value={surveyData.toldAboutCynto}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, toldAboutCynto: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="told-yes" />
                      <Label htmlFor="told-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="told-no" />
                      <Label htmlFor="told-no">No / لا</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dont-know" id="told-dont-know" />
                      <Label htmlFor="told-dont-know">I don't know / لا أعرف</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Did you give your consent? / هل أعطيت موافقتك؟</Label>
                  <RadioGroup
                    value={surveyData.gaveConsent}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, gaveConsent: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="consent-yes" />
                      <Label htmlFor="consent-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="consent-no" />
                      <Label htmlFor="consent-no">No / لا</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dont-remember" id="consent-dont-remember" />
                      <Label htmlFor="consent-dont-remember">I don't remember / لا أتذكر</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you know why you were given Cytotec? / هل كنت تعلمين لماذا تم إعطاؤك السيتوسين؟</Label>
                  <RadioGroup
                    value={surveyData.knewWhyCynto}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, knewWhyCynto: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="knew-yes" />
                      <Label htmlFor="knew-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="knew-no" />
                      <Label htmlFor="knew-no">No / لا</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* During labor */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">During labor / أثناء الولادة</h3>

                <div className="space-y-3">
                  <Label>
                    Did you have very strong or very fast contractions after the injection? / هل شعرت بتقلصات قوية جداً
                    أو سريعة جداً بعد الحقن؟
                  </Label>
                  <RadioGroup
                    value={surveyData.strongContractions}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, strongContractions: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="contractions-yes" />
                      <Label htmlFor="contractions-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="contractions-no" />
                      <Label htmlFor="contractions-no">No / لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Did you have more pain than you expected? / هل شعرت بألم أكثر مما كنت تتوقعين؟</Label>
                  <RadioGroup
                    value={surveyData.morePainThanExpected}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, morePainThanExpected: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pain-yes" />
                      <Label htmlFor="pain-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pain-no" />
                      <Label htmlFor="pain-no">No / لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Did you ask to stop the medication? / هل طلبت إيقاف الدواء؟</Label>
                  <RadioGroup
                    value={surveyData.askedToStop}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, askedToStop: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="stop-yes" />
                      <Label htmlFor="stop-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="stop-no" />
                      <Label htmlFor="stop-no">No / لا</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="didnt-dare" id="stop-didnt-dare" />
                      <Label htmlFor="stop-didnt-dare">I didn't dare / لم أجرؤ</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* After delivery */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">After delivery / بعد الولادة</h3>

                <div className="space-y-3">
                  <Label>Did you have problems after delivery? / هل واجهت مشاكل بعد الولادة؟</Label>
                  <RadioGroup
                    value={surveyData.problemsAfterDelivery}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, problemsAfterDelivery: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="problems-yes" />
                      <Label htmlFor="problems-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="problems-no" />
                      <Label htmlFor="problems-no">No / لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Did you feel respected during labor? / هل شعرت بأنه تم احترامك أثناء الولادة؟</Label>
                  <RadioGroup
                    value={surveyData.feltRespected}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, feltRespected: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="respected-yes" />
                      <Label htmlFor="respected-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="respected-no" />
                      <Label htmlFor="respected-no">No / لا</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a-little" id="respected-little" />
                      <Label htmlFor="respected-little">A little / قليلاً</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>
                    Do you think too much Cytotec was used? / هل تعتقدين أنه تم استخدام الكثير من السيتوسين؟
                  </Label>
                  <RadioGroup
                    value={surveyData.tooMuchCyntoUsed}
                    onValueChange={(value) => setSurveyData((prev) => ({ ...prev, tooMuchCyntoUsed: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="too-much-yes" />
                      <Label htmlFor="too-much-yes">Yes / نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="too-much-no" />
                      <Label htmlFor="too-much-no">No / لا</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dont-know" id="too-much-dont-know" />
                      <Label htmlFor="too-much-dont-know">I don't know / لا أعرف</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Complete Survey"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
