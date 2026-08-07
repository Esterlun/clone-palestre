import { requireCurrentUser } from "@/lib/auth";
import { listBodyMeasurements } from "@/modules/metrics/service";
import { AddMeasurementForm } from "./AddMeasurementForm";
import { MeasurementRow } from "./MeasurementRow";
import { MetricTrendChart } from "./MetricTrendChart";

export default async function MetricsPage() {
  const user = await requireCurrentUser();
  const measurements = await listBodyMeasurements(user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Metriche personali</h1>

      <div className="mt-6">
        <MetricTrendChart measurements={measurements} />
      </div>

      <div className="mt-6">
        <AddMeasurementForm />
      </div>

      {measurements.length === 0 ? (
        <p className="mt-6 text-text-secondary">Nessuna misurazione registrata ancora.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {measurements.map((measurement) => (
            <MeasurementRow key={measurement.id} measurement={measurement} />
          ))}
        </ul>
      )}
    </div>
  );
}
