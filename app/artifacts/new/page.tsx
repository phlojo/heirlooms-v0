import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { NewArtifactForm } from "@/components/new-artifact-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase/server"
import { getOrCreateUncategorizedCollection } from "@/lib/actions/collections"

export default async function NewArtifactPage({
  searchParams,
}: {
  searchParams: Promise<{ collectionId?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const { collectionId } = await searchParams

  let effectiveCollectionId = collectionId

  if (!effectiveCollectionId) {
    const result = await getOrCreateUncategorizedCollection(user.id)
    if (result.success && result.data) {
      effectiveCollectionId = result.data.id
    }
  }

  return (
    <AppLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">New Artifact</h1>
        </div>

        <NewArtifactForm collectionId={effectiveCollectionId} userId={user.id} />
      </div>
    </AppLayout>
  )
}
